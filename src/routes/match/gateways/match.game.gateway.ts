import * as child_process from "child_process";
import * as fs from "fs";
import * as path from "path";

import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { v4 as uuid } from "uuid";

import { CompilerTypeValues } from "../../../common/mapper/types";
import { RedisCacheService } from "../../../common/modules/redis.module";
import { ProblemGetService } from "../../problem/providers";

@WebSocketGateway(0, { namespace: "match/game", cors: "*" })
export class MatchGameGateway {
  constructor(
    private readonly redisService: RedisCacheService,
    private readonly problemGetService: ProblemGetService,
  ) {}

  round: number = 0;
  roundStart: number = -1;
  pauseStart = -1;
  pauseTmp = -1;
  // problemList: string[] = [
  //   "f59d1dd1-286f-4ac1-ac48-844ba35b2c92",
  //   "0c5df337-c0af-45a8-bdfa-ac306027d7be",
  // ];
  // problemList: string[] = [
  //   "f1d81ae3-5d6f-4bde-9f37-9a7ebf89ecf1",
  //   "a499fa9c-fe89-49ad-8a46-ad554b748326",
  //   "b483641d-45e3-44e7-815f-effea78d1799",
  // ];
  problemList: string[] = [
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
    "04cb6e11-a580-4d5a-8542-e4e6e31d3fc9",
  ];
  history: string[] = [];
  private currentCharCount: { [key: string]: number } = {};

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
    console.log(this.isDockerInitializing.has(client.id), this.isDockerInitializing.get(client.id));
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

      if (!CompilerTypeValues.find((ctv) => ctv === type)) return "error";

      fs.mkdirSync(path.join(basePath, id));
      fs.copyFileSync(
        path.join(basePath, `Dockerfile_run_${type}`),
        path.join(basePath, id, "Dockerfile"),
      );
      fs.writeFileSync(path.join(basePath, id, "code"), code, {
        flag: "w",
      });
      const debug1 = await new Promise((accept) => {
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

      client.emit("executed", "true");
      if (debug1) {
        client.emit("out_error", (debug1 as child_process.ExecException).stderr);
        client.emit("out_error", (debug1 as child_process.ExecException).stdout);
        const message = (debug1 as child_process.ExecException).message.indexOf("RUN g++");
        client.emit("out_error", (debug1 as child_process.ExecException).message.slice(message));
      }
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
        const dockerContainer = this.dockerContainers.get(client.id);
        if (dockerContainer) {
          child_process.exec(`docker kill ${id}`);
          dockerContainer.process.kill();
          fs.rmSync(path.join(basePath, id), { recursive: true, force: true });
          this.dockerContainers.delete(client.id);
          client.emit("out_error", "Timeout");
        }
      }, 60000);
    }
    this.isDockerInitializing.set(client.id, false);
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

  @SubscribeMessage("setCharCount")
  async setCharCount(client: Socket, data) {
    this.currentCharCount[data.user] = data.count;
    this.server.emit("charCount", this.currentCharCount);
  }

  @SubscribeMessage("getCharCount")
  async getCharCount(client: Socket, data) {
    this.server.emit("charCount", this.currentCharCount);
  }

  @SubscribeMessage("getProblem")
  async getProblem(client: Socket, data) {
    this.server.emit("problem_set", this.problemList[this.round]);
  }

  @SubscribeMessage("get_submission")
  async getSubmission(client: Socket, data) {
    this.server.emit("data_submissions", {
      body: await this.redisService.getJSON("submition"),
    });
  }

  @SubscribeMessage("get_history")
  async getHistory(client: Socket, data) {
    this.server.emit("data_history", {
      body: await Promise.all(
        this.history.map(async (e, i) => {
          return [(await this.problemGetService.getPublicProblemById(this.problemList[i])).name, e];
        }),
      ),
    });
  }

  @SubscribeMessage("get_round_time")
  async getTime(client: Socket, data) {
    this.server.emit("time_round_start", {
      body: this.roundStart,
    });
  }

  @SubscribeMessage("get_result")
  async getResult(client: Socket, data) {
    this.server.emit("match_result", this.history);
  }

  async startRound() {
    this.roundStart = Date.now();
    this.server.emit("time_round_start", {
      body: this.roundStart,
    });
  }

  async pauseRound() {
    if (this.roundStart === -2) {
      this.roundStart = this.pauseTmp + Date.now() - this.pauseStart;
      this.pauseTmp = -1;
      this.pauseStart = -1;
    } else {
      this.pauseTmp = this.roundStart;
      this.roundStart = -2;
      this.pauseStart = Date.now();
    }
    this.server.emit("time_round_start", {
      body: this.roundStart,
    });
  }

  async endRound() {
    this.roundStart = -1;
    this.server.emit("time_round_start", {
      body: this.roundStart,
    });
  }

  async roundEnd(winUser: string) {
    if (this.round < this.problemList.length) this.round++;
    this.history.push(winUser);

    if (this.round === this.problemList.length) {
      const winCount = {};
      this.history.forEach((e, i) => {
        if (!winCount[e]) winCount[e] = 0;
        winCount[e]++;
      });
      const arr = Object.keys(winCount).map(function (key) {
        return winCount[key];
      });
      const max = Math.max(...arr);
      const winUser = Object.keys(winCount).filter(function (key) {
        return winCount[key] === max;
      });
      console.log(winUser);
      if (winUser.length > 1 || winUser[0] == "null") {
        this.server.emit("match:draw");
        return;
      }
      this.server.emit("match:finish", winUser[0]);
    } else {
      try {
        if (winUser === null) {
          this.server.emit("round:draw");
          return;
        } else {
          this.server.emit("round:finish", winUser);
        }
      } finally {
        setTimeout(() => {
          this.server.emit("problem_set", this.problemList[this.round]);
        }, 2000);
        setTimeout(() => {
          this.server.emit("reset");
        }, 5000);
      }
    }
  }
}
