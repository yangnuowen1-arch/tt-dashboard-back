"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CreativesGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreativesGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const ws_1 = require("ws");
let CreativesGateway = CreativesGateway_1 = class CreativesGateway {
    logger = new common_1.Logger(CreativesGateway_1.name);
    server;
    afterInit(_server) {
        this.logger.log("WebSocket gateway initialized at /ws/creative-jobs");
    }
    handleConnection(client) {
        this.logger.log("Client connected");
        client.send(JSON.stringify({ type: "connected", message: "ok" }));
    }
    handleDisconnect(_client) {
        this.logger.log("Client disconnected");
    }
    broadcast(message) {
        const payload = JSON.stringify(message);
        this.server.clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(payload);
            }
        });
    }
};
exports.CreativesGateway = CreativesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", ws_1.Server)
], CreativesGateway.prototype, "server", void 0);
exports.CreativesGateway = CreativesGateway = CreativesGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ path: "/ws/creative-jobs" })
], CreativesGateway);
//# sourceMappingURL=creatives.gateway.js.map