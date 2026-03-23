import apiClient from "./apiClient";
import {
  type User,
  UserSchema,
  type UserCreateRequest,
  type UserUpdateRequest,
  type UserUpdatePasswordRequest,
  type AdminUserUpdateRequest,
} from "../schemas/entities";

const userService = {
  /**
   * List all registered users (Admin only)
   */
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<User[]>("/users");
    // Ensure each user in the array is valid
    return response.data.map((user) => UserSchema.parse(user));
  },

  /**
   * Create a new user manually (Admin only)
   */
  async create(data: UserCreateRequest): Promise<User> {
    const response = await apiClient.post("/users", data);
    return UserSchema.parse(response.data);
  },

  /**
   * Update any field of a specific user (Admin only)
   */
  async update(userId: string, data: AdminUserUpdateRequest): Promise<User> {
    const response = await apiClient.patch(`/users/${userId}`, data);
    return UserSchema.parse(response.data);
  },

  /**
   * Permanently delete a user (Admin only)
   */
  async delete(userId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}`);
  },

  /**
   * Update the current user's profile information
   */
  async updateMe(data: UserUpdateRequest): Promise<User> {
    const response = await apiClient.patch("/users/me", data);
    return UserSchema.parse(response.data);
  },

  /**
   * Update the current user's password
   */
  async updatePassword(data: UserUpdatePasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.patch("/users/me/password", data);
    return response.data;
  },
};

export default userService;
