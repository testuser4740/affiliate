import { JsonController, Post, Put, Body, UnauthorizedError, BadRequestError, Authorized, CurrentUser } from "routing-controllers";
import { Service, Inject } from "typedi";
import { AuthService } from "../../auth/AuthService";
import { signToken, AuthUser, hashPassword } from "../lib/auth";
import { getConnection } from "../../loaders/typeormLoader";
import { User } from "../models/users";

class LoginInput {
  email: string;
  password: string;
}

class ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
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
    const result = await this.authService.validateWithStatus(body.email, body.password);
    if (!result) {
      throw new UnauthorizedError("Invalid email or password");
    }
    if (result.status === "pending") {
      throw new UnauthorizedError("Waiting for Admin Approval");
    }
    const user = result.user!;
    const authUser = this.authService.toAuthUser(user);
    const token = signToken(authUser);
    return {
      token,
      user: authUser,
    };
  }

  @Put("/password")
  @Authorized()
  async changePassword(
    @CurrentUser() currentUser: AuthUser,
    @Body() body: ChangePasswordInput,
  ) {
    if (!body.newPassword || body.newPassword.length < 6) {
      throw new BadRequestError("New password must be at least 6 characters");
    }
    const userRepo = getConnection().getRepository(User);
    const user = await userRepo.findOne({ where: { id: currentUser.id } });
    if (!user) {
      throw new UnauthorizedError("User not found");
    }
    user.passwordHash = hashPassword(body.newPassword);
    await userRepo.save(user);
    return { message: "Password updated successfully" };
  }
}
