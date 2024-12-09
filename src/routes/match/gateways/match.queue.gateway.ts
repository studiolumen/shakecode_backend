import { Logger } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { MatchService } from "../providers";

@WebSocketGateway(0, { namespace: "match/queue", cors: "*" })
export class MatchQueueGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly matchService: MatchService) {}

  private logger: Logger = new Logger("MatchQueueGateway");

  @SubscribeMessage("register")
  handleEvent(client: Socket, @MessageBody() data: string): string {
    return data;
  }
}
