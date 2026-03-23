import apiClient from "./apiClient";
import { type Category, CategorySchema } from "../schemas/entities";

const categoryService = {
  /**
   * List all available asset categories
   */
  async getAll(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>("/categories/");
    return response.data.map((cat) => CategorySchema.parse(cat));
  },
};

export default categoryService;
