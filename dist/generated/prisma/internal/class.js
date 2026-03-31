"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.6.0",
    "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
    "activeProvider": "postgresql",
    "inlineSchema": "generator client {\n  provider = \"prisma-client\"\n  output   = \"../generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel users {\n  id         Int       @id @default(autoincrement())\n  email      String    @unique @db.VarChar(255)\n  password   String    @db.VarChar(255)\n  name       String?   @db.VarChar(100)\n  avatar     String?   @db.VarChar(500)\n  role       String?   @default(\"user\") @db.VarChar(20)\n  is_active  Boolean?  @default(true)\n  created_at DateTime? @default(now()) @db.Timestamp(6)\n  updated_at DateTime? @default(now()) @db.Timestamp(6)\n\n  @@index([email], map: \"idx_users_email\")\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    },
    "parameterizationSchema": {
        "strings": [],
        "graph": ""
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"users\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"avatar\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"is_active\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"users.findUnique\",\"users.findUniqueOrThrow\",\"orderBy\",\"cursor\",\"users.findFirst\",\"users.findFirstOrThrow\",\"users.findMany\",\"data\",\"users.createOne\",\"users.createMany\",\"users.createManyAndReturn\",\"users.updateOne\",\"users.updateMany\",\"users.updateManyAndReturn\",\"create\",\"update\",\"users.upsertOne\",\"users.deleteOne\",\"users.deleteMany\",\"having\",\"_count\",\"_avg\",\"_sum\",\"_min\",\"_max\",\"users.groupBy\",\"users.aggregate\",\"AND\",\"OR\",\"NOT\",\"id\",\"email\",\"password\",\"name\",\"avatar\",\"role\",\"is_active\",\"created_at\",\"updated_at\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"contains\",\"startsWith\",\"endsWith\",\"set\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
    graph: "PAsQDBwAACwAMB0AAAQAEB4AACwAMB8CAAAAASABAAAAASEBAC4AISIBAC8AISMBAC8AISQBAC8AISUgADAAISZAADEAISdAADEAIQEAAAABACABAAAAAQAgDBwAACwAMB0AAAQAEB4AACwAMB8CAC0AISABAC4AISEBAC4AISIBAC8AISMBAC8AISQBAC8AISUgADAAISZAADEAISdAADEAIQYiAAAyACAjAAAyACAkAAAyACAlAAAyACAmAAAyACAnAAAyACADAAAABAAgAwAABQAwBAAAAQAgAwAAAAQAIAMAAAUAMAQAAAEAIAMAAAAEACADAAAFADAEAAABACAJHwIAAAABIAEAAAABIQEAAAABIgEAAAABIwEAAAABJAEAAAABJSAAAAABJkAAAAABJ0AAAAABAQgAAAkAIAkfAgAAAAEgAQAAAAEhAQAAAAEiAQAAAAEjAQAAAAEkAQAAAAElIAAAAAEmQAAAAAEnQAAAAAEBCAAACwAwAQgAAAsAMAkfAgA8ACEgAQA4ACEhAQA4ACEiAQA5ACEjAQA5ACEkAQA5ACElIAA6ACEmQAA7ACEnQAA7ACECAAAAAQAgCAAADgAgCR8CADwAISABADgAISEBADgAISIBADkAISMBADkAISQBADkAISUgADoAISZAADsAISdAADsAIQIAAAAEACAIAAAQACACAAAABAAgCAAAEAAgAwAAAAEAIA8AAAkAIBAAAA4AIAEAAAABACABAAAABAAgCxUAADMAIBYAADQAIBcAADcAIBgAADYAIBkAADUAICIAADIAICMAADIAICQAADIAICUAADIAICYAADIAICcAADIAIAwcAAAaADAdAAAXABAeAAAaADAfAgAbACEgAQAcACEhAQAcACEiAQAdACEjAQAdACEkAQAdACElIAAeACEmQAAfACEnQAAfACEDAAAABAAgAwAAFgAwFAAAFwAgAwAAAAQAIAMAAAUAMAQAAAEAIAwcAAAaADAdAAAXABAeAAAaADAfAgAbACEgAQAcACEhAQAcACEiAQAdACEjAQAdACEkAQAdACElIAAeACEmQAAfACEnQAAfACENFQAAKAAgFgAAKwAgFwAAKAAgGAAAKAAgGQAAKAAgKAIAAAABKQIAAAAEKgIAAAAEKwIAAAABLAIAAAABLQIAAAABLgIAAAABLwIAKgAhDhUAACgAIBgAACkAIBkAACkAICgBAAAAASkBAAAABCoBAAAABCsBAAAAASwBAAAAAS0BAAAAAS4BAAAAAS8BACcAITABAAAAATEBAAAAATIBAAAAAQ4VAAAhACAYAAAmACAZAAAmACAoAQAAAAEpAQAAAAUqAQAAAAUrAQAAAAEsAQAAAAEtAQAAAAEuAQAAAAEvAQAlACEwAQAAAAExAQAAAAEyAQAAAAEFFQAAIQAgGAAAJAAgGQAAJAAgKCAAAAABLyAAIwAhCxUAACEAIBgAACIAIBkAACIAIChAAAAAASlAAAAABSpAAAAABStAAAAAASxAAAAAAS1AAAAAAS5AAAAAAS9AACAAIQsVAAAhACAYAAAiACAZAAAiACAoQAAAAAEpQAAAAAUqQAAAAAUrQAAAAAEsQAAAAAEtQAAAAAEuQAAAAAEvQAAgACEIKAIAAAABKQIAAAAFKgIAAAAFKwIAAAABLAIAAAABLQIAAAABLgIAAAABLwIAIQAhCChAAAAAASlAAAAABSpAAAAABStAAAAAASxAAAAAAS1AAAAAAS5AAAAAAS9AACIAIQUVAAAhACAYAAAkACAZAAAkACAoIAAAAAEvIAAjACECKCAAAAABLyAAJAAhDhUAACEAIBgAACYAIBkAACYAICgBAAAAASkBAAAABSoBAAAABSsBAAAAASwBAAAAAS0BAAAAAS4BAAAAAS8BACUAITABAAAAATEBAAAAATIBAAAAAQsoAQAAAAEpAQAAAAUqAQAAAAUrAQAAAAEsAQAAAAEtAQAAAAEuAQAAAAEvAQAmACEwAQAAAAExAQAAAAEyAQAAAAEOFQAAKAAgGAAAKQAgGQAAKQAgKAEAAAABKQEAAAAEKgEAAAAEKwEAAAABLAEAAAABLQEAAAABLgEAAAABLwEAJwAhMAEAAAABMQEAAAABMgEAAAABCCgCAAAAASkCAAAABCoCAAAABCsCAAAAASwCAAAAAS0CAAAAAS4CAAAAAS8CACgAIQsoAQAAAAEpAQAAAAQqAQAAAAQrAQAAAAEsAQAAAAEtAQAAAAEuAQAAAAEvAQApACEwAQAAAAExAQAAAAEyAQAAAAENFQAAKAAgFgAAKwAgFwAAKAAgGAAAKAAgGQAAKAAgKAIAAAABKQIAAAAEKgIAAAAEKwIAAAABLAIAAAABLQIAAAABLgIAAAABLwIAKgAhCCgIAAAAASkIAAAABCoIAAAABCsIAAAAASwIAAAAAS0IAAAAAS4IAAAAAS8IACsAIQwcAAAsADAdAAAEABAeAAAsADAfAgAtACEgAQAuACEhAQAuACEiAQAvACEjAQAvACEkAQAvACElIAAwACEmQAAxACEnQAAxACEIKAIAAAABKQIAAAAEKgIAAAAEKwIAAAABLAIAAAABLQIAAAABLgIAAAABLwIAKAAhCygBAAAAASkBAAAABCoBAAAABCsBAAAAASwBAAAAAS0BAAAAAS4BAAAAAS8BACkAITABAAAAATEBAAAAATIBAAAAAQsoAQAAAAEpAQAAAAUqAQAAAAUrAQAAAAEsAQAAAAEtAQAAAAEuAQAAAAEvAQAmACEwAQAAAAExAQAAAAEyAQAAAAECKCAAAAABLyAAJAAhCChAAAAAASlAAAAABSpAAAAABStAAAAAASxAAAAAAS1AAAAAAS5AAAAAAS9AACIAIQAAAAAAAAEzAQAAAAEBMwEAAAABATMgAAAAAQEzQAAAAAEFMwIAAAABNAIAAAABNQIAAAABNgIAAAABNwIAAAABAAAAAAUVAAYWAAcXAAgYAAkZAAoAAAAAAAUVAAYWAAcXAAgYAAkZAAoBAgECAwEFBgEGBwEHCAEJCgEKDAILDQMMDwENEQIOEgQREwESFAETFQIaGAUbGQs"
};
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await import('node:buffer');
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map