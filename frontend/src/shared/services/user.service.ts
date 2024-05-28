import { tokenInstance } from "src/shared/services/token-instance.ts";
import { ApiResponse } from "src/shared/services/types/response.type.ts";
import { User } from "src/shared/models/types/user.types.ts";

class UserService {
  async getUser() {
    const { data } = await tokenInstance.get<ApiResponse<User>>("/user");
    return data.data;
  }
}

export default new UserService();
