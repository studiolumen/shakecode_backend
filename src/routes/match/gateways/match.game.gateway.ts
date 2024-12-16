import * as child_process from "child_process";
import * as fs from "fs";
import * as path from "path";

import { Logger } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { v4 as uuid } from "uuid";

@WebSocketGateway(0, { namespace: "match/game", cors: "*" })
export class MatchGameGateway {
  private dockerContainers: Map<
    string,
    { id: string; process: child_process.ChildProcessWithoutNullStreams }
  > = new Map();

  private isDockerInitializing: Map<string, boolean> = new Map();

  private logger: Logger = new Logger("MatchQueueGateway");

  @WebSocketServer()
  server: Server;

  @SubscribeMessage("execute")
  async executeCode(client: Socket, data) {
    if (this.isDockerInitializing.has(client.id) && this.isDockerInitializing.get(client.id))
      return "error";
    this.isDockerInitializing.set(client.id, true);
    if (this.dockerContainers.has(client.id)) {
      const container = this.dockerContainers.get(client.id);
      child_process.exec(`docker kill ${container.id}`);
      container.process.kill();
      this.dockerContainers.delete(client.id);
    }

    const id = uuid();
    const basePath = path.join(__dirname, "../../../common/docker");
    const workDir = { cwd: path.join(basePath, id) };

    try {
      const type = data.body.split("\n")[0];
      const code = data.body.split("\n").slice(1).join("\n");

      fs.mkdirSync(path.join(basePath, id));
      fs.copyFileSync(
        path.join(basePath, `Dockerfile_${type}`),
        path.join(basePath, id, "Dockerfile"),
      );
      fs.writeFileSync(path.join(basePath, id, "code"), code, {
        flag: "w",
      });
      await new Promise((accept) => {
        child_process.exec(`docker build . -t ${id}`, workDir, accept);
      });

      const dockerContainer = child_process.spawn("docker", [
        "run",
        "-i",
        "--rm",
        "--name",
        id,
        id,
      ]);

      dockerContainer.stdout.on("data", (data) => {
        client.emit("out_plain", data.toString());
      });

      dockerContainer.stderr.on("data", (data) => {
        client.emit("out_error", data.toString());
      });

      dockerContainer.on("exit", (code) => {
        client.emit("out_exit", code);
        child_process.exec(`docker kill ${id}`);
        this.dockerContainers.delete(client.id);
        fs.rmSync(path.join(basePath, id), { recursive: true, force: true });
      });

      this.dockerContainers.set(client.id, { id, process: dockerContainer });
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        this.isDockerInitializing.set(client.id, false);
        const dockerContainer = this.dockerContainers.get(client.id);
        if (dockerContainer) {
          child_process.exec(`docker kill ${id}`);
          dockerContainer.process.kill();
          fs.rmSync(path.join(basePath, id), { recursive: true, force: true });
          this.dockerContainers.delete(client.id);
        }
        client.emit("out_error", "Timeout");
      }, 60000);
    }

    return "ok";
  }

  @SubscribeMessage("input")
  async inputToExecution(client: Socket, data) {
    if (this.dockerContainers.has(client.id)) {
      const dockerContainer = this.dockerContainers.get(client.id);
      dockerContainer.process.stdin.write(data.body + "\n");
      return "ok";
    } else {
      return "error";
    }
  }

  @SubscribeMessage("exit")
  async exitExecution(client: Socket, data) {
    if (this.dockerContainers.has(client.id)) {
      const dockerContainer = this.dockerContainers.get(client.id);
      child_process.exec(`docker kill ${dockerContainer.id}`);
      dockerContainer.process.kill();
      this.dockerContainers.delete(client.id);
      return "ok";
    } else {
      return "404";
    }
  }
}
