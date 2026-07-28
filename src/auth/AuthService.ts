import { Service } from "typedi";
import { AuthUser } from "./authorizationChecker";
import { User } from "../api/models/users";
import { Applicant } from "../api/models/applicants";
import { getConnection } from "../loaders/typeormLoader";
import { verifyPassword } from "../api/lib/auth";

@Service()
export class AuthService {
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

  public async validateWithStatus(
    email: string,
    password: string,
  ): Promise<{ user: User; status: "active" } | { status: "pending" } | undefined> {
    const trimmed = email.trim().toLowerCase();
    const userRepo = getConnection().getRepository(User);
    const user = await userRepo.findOne({ where: { email: trimmed } });
    if (user) {
      if (!verifyPassword(password, user.passwordHash)) return undefined;
      return { user, status: "active" };
    }
    const applicantRepo = getConnection().getRepository(Applicant);
    const applicant = await applicantRepo.findOne({ where: { email: trimmed } });
    if (applicant && applicant.status !== "Approved") {
      return { status: "pending" };
    }
    return undefined;
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
