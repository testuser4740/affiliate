import { JsonController, Post, Body, UnauthorizedError, BadRequestError } from "routing-controllers";
import { Service, Inject } from "typedi";
import { AuthService } from "../../auth/AuthService";
import { signToken, AuthUser } from "../lib/auth";

class LoginInput {
  email: string;
  password: string;
}

@JsonController("/auth")
@Service()
export class AuthController {
  @Inject()
  private authService!: AuthService;

  @Post("/login")
  async login(@Body() body: LoginInput) {
    if (!body || !body.email || !body.password) {
      throw new BadRequestError("Email and password are required");
    }
    const user = await this.authService.validateCredentials(body.email, body.password);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }
    const authUser = this.authService.toAuthUser(user);
    const token = signToken(authUser);
    return {
      token,
      user: authUser,
    };
  }
}
