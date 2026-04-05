import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
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
export declare class CreativesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger;
    server: Server;
    afterInit(_server: Server): void;
    handleConnection(client: WebSocket): void;
    handleDisconnect(_client: WebSocket): void;
    broadcast(message: CreativeJobMessage): void;
}
