import { Logger } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, WebSocket } from "ws";

export interface CreativeJobMessage {
  type: "creative_job";
  clientItemId: string;
  jobId?: string;
  status: string;
  progress?: number;
  assetUrl?: string;
  coverUrl?: string;
  error?: string | null;
}

@WebSocketGateway({ path: "/ws/creative-jobs" })
export class CreativesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(CreativesGateway.name);

  @WebSocketServer()
  server: Server;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(_server: Server): void {
    this.logger.log("WebSocket gateway initialized at /ws/creative-jobs");
  }

  handleConnection(client: WebSocket): void {
    this.logger.log("Client connected");
    client.send(JSON.stringify({ type: "connected", message: "ok" }));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(_client: WebSocket): void {
    this.logger.log("Client disconnected");
  }

  /**
   * Broadcast a job progress message to ALL connected clients.
   */
  broadcast(message: CreativeJobMessage): void {
    const payload = JSON.stringify(message);
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }
}
