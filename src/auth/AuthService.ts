import { Service } from "typedi";
import { AuthUser } from "./authorizationChecker";
import { User } from "../api/models/users";
import { getConnection } from "../loaders/typeormLoader";
import { verifyPassword } from "../api/lib/auth";

@Service()
export class AuthService {
  /**
   * Validate credentials against the users table.
   * Returns the matching User (with password hash) or undefined.
   */
  public async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const repo = getConnection().getRepository(User);
    const user = await repo.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user) return undefined;
    if (!verifyPassword(password, user.passwordHash)) return undefined;
    return user;
  }

  public toAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      role: user.role,
      ambassadorId: user.ambassadorId,
      email: user.email,
      name: user.name,
    };
  }
}
