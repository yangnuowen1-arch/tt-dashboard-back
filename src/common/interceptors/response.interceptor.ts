import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse } from "../interfaces/api-response.interface";

interface ResponseBody<T> {
  data: T;
  message?: string;
}

function isResponseBody<T>(value: unknown): value is ResponseBody<T> {
  return typeof value === "object" && value !== null && "data" in value;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<unknown>
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<unknown>> {
    return next.handle().pipe(
      map((value) => {
        if (isResponseBody(value)) {
          return {
            success: true,
            data: value.data,
            message: value.message ?? "请求成功",
          };
        }

        return {
          success: true,
          data: value,
          message: "请求成功",
        };
      }),
    );
  }
}
