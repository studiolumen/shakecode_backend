import { Logger } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { MatchService } from "../providers";

@WebSocketGateway(0, { namespace: "matchGame", cors: "*" })
export class MatchGameGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly matchService: MatchService) {}

  private logger: Logger = new Logger("MatchGameGateway");

  @SubscribeMessage("events")
  handleEvent(client: Socket, data: string): string {
    return client.id;
  }
}
