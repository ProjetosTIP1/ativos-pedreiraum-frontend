import { useState, useEffect } from "react";
import { useAssetStore } from "../../../stores/useAssetStore";
import type { Asset } from "../../../schemas/entities";

/**
 * Custom hook to manage Asset form state
 * Handles initialization from existing asset (edit mode) and form field updates
 */
export const useAssetFormData = (assetId?: string) => {
  const { assets } = useAssetStore();

  const [formData, setFormData] = useState<Partial<Asset>>({
    name: "",
    category: "OTHER",
    subcategory: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    serial_number: "",
    location: "",
    condition: "GOOD",
    status: "PENDING",
    price: undefined,
    description: "",
    images: [],
    is_featured: false,
  });

  // Load existing asset data in edit mode (derived state, not effect)
  const existingAsset = assetId ? assets.find((a) => a.id === assetId) : null;
  
  // Initialize formData from existing asset when found
  useEffect(() => {
    if (existingAsset && Object.keys(formData).length === 13) {
      // Only initialize if formData is still at default values
      setFormData((prev) => ({ ...prev, ...existingAsset }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingAsset?.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? parseFloat(e.target.value) : undefined;
    setFormData((prev) => ({ ...prev, price: val }));
  };

  return {
    formData,
    setFormData,
    handleChange,
    handlePriceChange,
  };
};
