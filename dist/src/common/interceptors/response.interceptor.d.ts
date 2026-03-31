import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { ApiResponse } from "../interfaces/api-response.interface";
export declare class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<unknown>> {
    intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<unknown>>;
}
