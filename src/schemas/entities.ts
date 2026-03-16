import { z } from "zod";

// --- Enums ---

export const UserRole = z.enum(["ADMIN", "REGULAR"]);
export type UserRole = z.infer<typeof UserRole>;

export const AssetStatus = z.enum(["PENDING", "AVAILABLE", "RESERVED", "SOLD", "REJECTED"]);
export type AssetStatus = z.infer<typeof AssetStatus>;

export const AssetCondition = z.enum(["EXCELLENT", "GOOD", "REGULAR"]);
export type AssetCondition = z.infer<typeof AssetCondition>;

export const AssetCategory = z.enum([
    "TRUCKS",
    "EXCAVATORS",
    "CRUSHERS",
    "GRADERS",
    "PLANT",
    "PARTS",
    "OTHER",
]);
export type AssetCategory = z.infer<typeof AssetCategory>;

export const PartState = z.enum(["NEW", "REFURBISHED", "USED"]);
export type PartState = z.infer<typeof PartState>;

// --- Entities ---

export const UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    full_name: z.string(),
    role: UserRole,
    created_at: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    parent_id: z.number().optional(),
});
export type Category = z.infer<typeof CategorySchema>;

export const BranchSchema = z.object({
    id: z.number(),
    name: z.string(),
    location: z.string(),
    contact_info: z.string().optional(),
});
export type Branch = z.infer<typeof BranchSchema>;

export const ImageMetadataSchema = z.object({
    id: z.string().uuid(),
    asset_id: z.string().uuid(),
    url: z.string().url(),
    name: z.string(),
    alt_text: z.string().optional(),
    content_type: z.string().optional(),
    size: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    is_main: z.boolean(),
    created_at: z.string(),
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

export const PartSpecsSchema = z.object({
    oem_code: z.string(),
    compatible_equipment: z.string(),
    part_state: PartState,
});
export type PartSpecs = z.infer<typeof PartSpecsSchema>;

// --- Asset Entity ---

export const AssetSchema = z.object({
    id: z.string().uuid(),
    slug: z.string(),
    name: z.string().min(3).max(100),
    category: AssetCategory,
    subcategory: z.string(),
    brand: z.string(),
    model: z.string(),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
    serial_number: z.string(),
    location: z.string(),
    condition: AssetCondition,
    status: AssetStatus,
    price: z.number().positive().optional(),
    description: z.string(),
    main_image: z.string().url(),
    gallery: z.array(z.string().url()),
    is_featured: z.boolean(),
    view_count: z.number().int().nonnegative(),
    branch_id: z.number().int(),
    created_by_user_id: z.string().uuid().optional(),
    created_at: z.string(),
    specifications: z.union([
        TruckSpecsSchema,
        ExcavatorSpecsSchema,
        PartSpecsSchema,
        z.any()
    ]).optional(),
});
export type Asset = z.infer<typeof AssetSchema>;
