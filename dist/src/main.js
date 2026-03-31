"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const prisma_service_1 = require("./prisma/prisma.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const prismaService = app.get(prisma_service_1.PrismaService);
    prismaService.enableShutdownHooks(app);
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle("TT 后端 API")
        .setDescription("TT 项目后端接口文档")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup("api-docs", app, document);
    await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((error) => {
    common_1.Logger.error(error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map