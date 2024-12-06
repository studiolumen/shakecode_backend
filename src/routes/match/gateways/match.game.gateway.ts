import * as child_process from "child_process";
import * as fs from "fs";
import * as path from "path";

import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { v4 as uuid } from "uuid";

@WebSocketGateway(0, { namespace: "match/game", cors: "*" })
export class MatchGameGateway {
  private dockerContainers: Map<
    string,
    child_process.ChildProcessWithoutNullStreams
  > = new Map();

  @WebSocketServer()
  server: Server;

  @SubscribeMessage("execute")
  async executeCode(client: Socket, data) {
    if (this.dockerContainers.has(client.id)) {
      const container = this.dockerContainers.get(client.id);
      container.kill();
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
        this.dockerContainers.delete(client.id);
        fs.rmSync(path.join(basePath, id), { recursive: true, force: true });
      });

      this.dockerContainers.set(client.id, dockerContainer);
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        const dockerContainer = this.dockerContainers.get(client.id);
        if (dockerContainer) {
          dockerContainer.kill();
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
    console.log(this.dockerContainers.values());
    if (this.dockerContainers.has(client.id)) {
      const dockerContainer = this.dockerContainers.get(client.id);
      dockerContainer.stdin.write(data.body + "\n");
      return "ok";
    } else {
      this.dockerContainers.delete(client.id);
      return "error";
    }
  }

  @SubscribeMessage("exit")
  async exitExecution(client: Socket, data) {
    if (this.dockerContainers.has(client.id)) {
      const dockerContainer = this.dockerContainers.get(client.id);
      dockerContainer.kill();
      this.dockerContainers.delete(client.id);
      return "ok";
    } else {
      return "404";
    }
  }
}
