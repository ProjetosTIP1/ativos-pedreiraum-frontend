import { z } from "zod";

// --- Enums (Reflecting Backend values in Portuguese) ---

export const UserRole = z.enum(["ADMIN", "REGULAR"]);
export type UserRole = z.infer<typeof UserRole>;

export const AssetStatus = z.enum([
  "PENDENTE",
  "DISPONÍVEL",
  "RESERVADO",
  "VENDIDO",
  "REJEITADO",
]);
export type AssetStatus = z.infer<typeof AssetStatus>;

export const AssetCondition = z.enum(["EXCELENTE", "BOM", "REGULAR"]);
export type AssetCondition = z.infer<typeof AssetCondition>;

export const AssetCategory = z.enum([
  "CAMINHÕES",
  "ESCAVADEIRAS",
  "BRITADORES",
  "MOTONIVELADORAS",
  "PLANTA",
  "PEÇAS",
  "OUTROS",
]);
export type AssetCategory = z.infer<typeof AssetCategory>;

export const ImagePosition = z.enum([
  "FRENTE",
  "TRÁS",
  "LADO_ESQUERDO",
  "LADO_DIREITO",
  "INTERIOR",
  "MOTOR",
  "PNEU",
  "PAINEL",
  "OUTROS",
]);
export type ImagePosition = z.infer<typeof ImagePosition>;

// --- Entities ---

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string(),
  contact: z.string(),
  role: UserRole,
  created_at: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const UserCreateRequestSchema = UserSchema.omit({
  id: true,
  created_at: true,
}).extend({
  password: z.string().min(8),
});
export type UserCreateRequest = z.infer<typeof UserCreateRequestSchema>;

export const UserUpdateRequestSchema = z.object({
  full_name: z.string().optional(),
  contact: z.string().optional(),
});
export type UserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>;

export const UserUpdatePasswordRequestSchema = z.object({
  old_password: z.string(),
  new_password: z.string().min(8),
});
export type UserUpdatePasswordRequest = z.infer<typeof UserUpdatePasswordRequestSchema>;

export const AdminUserUpdateRequestSchema = UserUpdateRequestSchema.extend({
  role: UserRole.optional(),
  email: z.string().email().optional(),
});
export type AdminUserUpdateRequest = z.infer<typeof AdminUserUpdateRequestSchema>;

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  created_at: z.string().optional(),
});
export type Category = z.infer<typeof CategorySchema>;

export const ImageMetadataSchema = z.object({
  id: z.string().uuid(),
  asset_id: z.string().uuid().nullish(),
  url: z.string(),
  position: ImagePosition.default("OUTROS"),
  is_main: z.boolean().default(false),
  created_at: z.string().nullish(),
});
export type ImageMetadata = z.infer<typeof ImageMetadataSchema>;

// --- Polymorphic Specifications ---

export const TruckSpecsSchema = z.object({
  mileage: z.number(),
  traction: z.string(),
  load_capacity: z.number(),
  fuel_type: z.string(),
});
export type TruckSpecs = z.infer<typeof TruckSpecsSchema>;

export const ExcavatorSpecsSchema = z.object({
  operating_weight: z.number(),
  power: z.number(),
  hours: z.number(),
  bucket_capacity: z.number().optional(),
});
export type ExcavatorSpecs = z.infer<typeof ExcavatorSpecsSchema>;

// --- Asset Entity ---

export const AssetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  category: AssetCategory,
  subcategory: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  serial_number: z.string(),
  location: z.string(),
  condition: AssetCondition,
  status: AssetStatus,
  price: z.number().min(0).nullish(),
  description: z.string().min(10).max(1000),
  specifications: z.record(z.string(), z.unknown()).nullish(),
  rep_contact: z.string().nullish(),
  highlighted: z.boolean().default(false),
  view_count: z.number().int().nonnegative().default(0),
  created_by_user_id: z.string().uuid().nullish(),
  created_at: z.string(),
  updated_at: z.string().nullish(),
  images_metadata: ImageMetadataSchema.array().nullish(),
});
export type Asset = z.infer<typeof AssetSchema>;

export const CreateAssetRequestSchema = AssetSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  created_by_user_id: true,
  view_count: true,
  images_metadata: true,
});
export type CreateAssetRequest = z.infer<typeof CreateAssetRequestSchema>;

export const UpdateAssetRequestSchema = CreateAssetRequestSchema.partial();
export type UpdateAssetRequest = z.infer<typeof UpdateAssetRequestSchema>;
