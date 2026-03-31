import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { ApiResponse } from "../interfaces/api-response.interface";

type ErrorResponseBody = string | { message?: string | string[] };

function resolveMessage(response: ErrorResponseBody, fallback: string): string {
  if (typeof response === "string") {
    return response;
  }

  if (Array.isArray(response.message)) {
    return response.message.join(", ");
  }

  if (typeof response.message === "string") {
    return response.message;
  }

  return fallback;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as ErrorResponseBody;

      response.status(status).json({
        success: false,
        data: null,
        message: resolveMessage(exceptionResponse, exception.message),
      } satisfies ApiResponse<null>);

      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: "服务器内部错误",
    } satisfies ApiResponse<null>);
  }
}
