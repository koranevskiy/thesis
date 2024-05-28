import { HttpStatus, Injectable } from "@nestjs/common";
import { User } from "src/domain/user/entities/user.entity";
import { DefaultRolesEnum } from "src/domain/auth/roles.enum";
import { Role } from "src/domain/role/role.entity";
import { DomainException } from "#system/exceptions/domain.exception";
import { DataSource, FindOptionsWhere } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { UserToRole } from "src/domain/user/entities/user-role.entity";
import { RoleDto, UserDto } from "src/domain/user/dto/user.dto";
import { UserException } from "src/domain/user/exceptions/user.exception";

@Injectable()
export class UserService {
  @InjectDataSource()
  private dataSource: DataSource;
  constructor() {}

  private async saveUser(dto: Partial<User>, role: DefaultRolesEnum) {
    const user = new User();
    /*
      password, salt передаем только при регистрации или смене пароля
     */
    Object.assign<User, Partial<User>>(user, {
      first_name: dto.first_name.toLowerCase(),
      last_name: dto.last_name.toLowerCase(),
      middle_name: dto.middle_name?.toLowerCase(),
      email: dto.email.toLowerCase(),
      password: dto.password ?? undefined,
      salt: dto.salt ?? undefined,
    });
    const roleEntity = await Role.findOneBy({ role_name: role });
    if (!roleEntity) {
      throw new DomainException({
        code: HttpStatus.BAD_REQUEST,
        message: `Невозможно создать пользователя, роль ${role} не найдена`,
      });
    }

    const createdUser = await this.dataSource.transaction(async entityManager => {
      const createdUser = await entityManager.save(User, user);
      const userToRole = new UserToRole();
      userToRole.user = createdUser;
      userToRole.role = roleEntity;
      await entityManager.save(UserToRole, userToRole);
      return createdUser;
    });
    return this.findUserByIdOrEmail({ user_id: createdUser.user_id });
  }

  async createUser(dto: Partial<User>, role: DefaultRolesEnum) {
    return this.saveUser(dto, role);
  }

  async findUserByIdOrEmail(where: FindOptionsWhere<User>, withPassword = false): Promise<UserDto> {
    const user = (await User.findOne({
      where,
      select: ["user_id", "first_name", "last_name", "middle_name", "email", "password", "salt"],
    })) as unknown as UserDto;
    if (!user) {
      UserException.throwNotFound(
        where.user_id ? "user_id" : "email",
        where.user_id ? (where.user_id as number) : (where.email as string)
      );
    }
    if (!withPassword) {
      delete user.password;
      delete user.salt;
    }
    const roles: RoleDto[] = await UserToRole.createQueryBuilder("ur")
      .select("ur.role_id role_id")
      .leftJoin(Role, "r", "r.role_id = ur.role_id")
      .addSelect("r.role_name role_name")
      .where("ur.user_id = :user_id", { user_id: user.user_id })
      .getRawMany();
    user.roles = roles;
    return user;
  }

  async checkUserExistByEmail(email: string): Promise<boolean> {
    return User.existsBy({
      email: email,
    });
  }
}
