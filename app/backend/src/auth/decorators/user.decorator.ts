import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserRequestDto } from "../dto/auth.dto";

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user: UserRequestDto }>();
  return request.user;
});
