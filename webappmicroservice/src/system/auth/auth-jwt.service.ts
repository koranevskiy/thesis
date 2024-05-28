import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthJwtSignPayload, AuthJwtVerifyPayload } from "#system/auth/auth-jwt.types";
import * as crypto from "node:crypto";

@Injectable()
export class AuthJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: AuthJwtSignPayload) {
    return this.jwtService.signAsync(payload);
  }

  async verify(payload: AuthJwtVerifyPayload) {
    return this.jwtService.verifyAsync(payload.token);
  }

  async hashPassword(password: string, _salt?: string) {
    const salt: string =
      _salt ??
      (await new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            reject(err);
          } else {
            resolve(buf.toString("hex"));
          }
        });
      }));
    const hash: string = await new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 300, 64, "sha512", (err, buf) => {
        if (err) {
          reject(err);
        } else {
          resolve(buf.toString("hex"));
        }
      });
    });
    return { hash, salt };
  }

  async comparePassword(password: string, hashPassword: string, salt: string) {
    const { hash } = await this.hashPassword(password, salt);
    return hash === hashPassword;
  }
}
