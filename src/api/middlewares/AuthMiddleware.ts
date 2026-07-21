import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { verifyToken, AuthUser } from "../lib/auth";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

@Middleware({ type: "before" })
@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
  public use(request: Request, _response: Response, next: NextFunction): void {
    const header = request.headers["authorization"];
    if (header && typeof header === "string" && header.startsWith("Bearer ")) {
      const token = header.slice("Bearer ".length).trim();
      const user = verifyToken(token);
      if (user) {
        request.user = user;
      }
    }
    next();
  }
}
