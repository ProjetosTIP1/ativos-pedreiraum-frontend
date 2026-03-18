import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAssetStore } from "../stores/useAssetStore";
import { Button } from "../components/ui/Button";
import imageService from "../server/imageService";
import {
  Save,
  ArrowLeft,
  Camera,
  Trash2,
  AlertCircle,
  Settings,
  Package,
  Plus,
  X,
  Upload,
} from "lucide-react";
import {
  type Asset,
  AssetCategory,
  AssetCondition,
  AssetStatus,
  type ImageMetadata,
} from "../schemas/entities";
import style from "./AssetForm.module.css";
import Modal from "../components/modal/Modal";

// Define the POVs
const REQUIRED_POVS = [
  "Frente",
  "Traseira",
  "Lateral Direita",
  "Lateral Esquerda",
  "Interior / Cabine",
  "Motor",
  "Chassi / Serial",
  "Outros",
];

interface PositionedFile {
  file?: File;
  previewUrl?: string;
  position: string;
  existingMetadata?: ImageMetadata;
}

export const AssetForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
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

  const [positionedFiles, setPositionedFiles] = useState<PositionedFile[]>(
    REQUIRED_POVS.map((pos) => ({ position: pos })),
  );

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (id && assets.length > 0 && !initialized.current) {
      const assetToEdit = assets.find((a) => a.id === id);
      if (assetToEdit) {
        setFormData((prev) => ({ ...prev, ...assetToEdit }));

        // Map existing images to POVs
        if (assetToEdit.images) {
          const newPositionedFiles = REQUIRED_POVS.map((pos) => {
            const existing = assetToEdit.images?.find(
              (img) => img.position === pos,
            );
            return {
              position: pos,
              existingMetadata: existing,
              previewUrl: existing?.url,
            };
          });

          // Handle "Outros" which might have multiple
          const others = assetToEdit.images?.filter(
            (img) =>
              !REQUIRED_POVS.includes(img.position || "") ||
              img.position === "Outros",
          );
          // This is a simplification, we might need a more complex structure for multiple "Outros"

          setPositionedFiles(newPositionedFiles);
        }

        initialized.current = true;
      }
    }
  }, [id, assets]);

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

  const handleFileSelect = (position: string, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPositionedFiles((prev) =>
      prev.map((p) =>
        p.position === position ? { ...p, file, previewUrl } : p,
      ),
    );
  };

  const removeFile = (position: string) => {
    setPositionedFiles((prev) =>
      prev.map((p) =>
        p.position === position
          ? { ...p, file: undefined, previewUrl: p.existingMetadata?.url }
          : p,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Upload new images
      const uploadPromises = positionedFiles
        .filter((pf) => pf.file)
        .map(async (pf) => {
          const metadata = await imageService.uploadAnImage(
            pf.file!,
            pf.position,
          );
          return metadata;
        });

      const newUploadedMetadata = await Promise.all(uploadPromises);

      // 2. Combine with existing metadata
      const finalImages = [
        ...(formData.images || []).filter(
          (img) =>
            !positionedFiles.some(
              (pf) => pf.file && pf.position === img.position,
            ),
        ),
        ...newUploadedMetadata,
      ];

      // Ensure one is main (e.g., the "Frente" one)
      if (finalImages.length > 0 && !finalImages.some((img) => img.is_main)) {
        const front =
          finalImages.find((img) => img.position === "Frente") ||
          finalImages[0];
        front.is_main = true;
      }

      const finalData = { ...formData, images: finalImages };

      if (id) {
        await useAssetStore.getState().updateAsset(id, finalData);
      } else {
        await useAssetStore.getState().createAsset(finalData);
      }
      navigate("/admin");
    } catch (error) {
      console.error("Error saving asset:", error);
      alert("Erro ao salvar ativo ou fazer upload das imagens.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (
      window.confirm(
        "Tem certeza que deseja excluir este ativo permanentemente?",
      )
    ) {
      try {
        await useAssetStore.getState().deleteAsset(id);
        navigate("/admin");
      } catch (error) {
        console.error("Error deleting asset:", error);
      }
    }
  };

  return (
    <div className={style.container}>
      {/* Header */}
      <div className={style.header}>
        <div className={style.headerLeft}>
          <button
            onClick={() => navigate("/admin")}
            className={style.backButton}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className={style.title}>
            {id ? "Editar" : "Cadastrar"}{" "}
            <span className={style.highlight}>Ativo</span>
          </h1>
        </div>
        <div className={style.headerActions}>
          <Button variant="ghost" onClick={() => navigate("/admin")}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              "Enviando..."
            ) : (
              <>
                <Save size={18} /> Salvar Registro
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={style.formGrid}>
        {/* Left Column: Main Info */}
        <div className={style.mainColumn}>
          <div className={style.card}>
            <h3 className={style.cardTitle}>
              <Settings size={14} className={style.cardIcon} /> Informações
              Gerais
            </h3>

            <div className={style.inputGrid}>
              <div className={style.inputGroupFull}>
                <label className={style.label}>
                  Nome do Equipamento / Título
                </label>
                <input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={style.input}
                />
              </div>

              <div className={style.inputGroup}>
                <label className={style.label}>Categoria</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={style.input}
                >
                  {AssetCategory.options.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className={style.inputGroup}>
                <label className={style.label}>Subcategoria</label>
                <input
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className={style.input}
                  placeholder="Ex: 6x4, Basculante, etc."
                />
              </div>

              <div className={style.inputGroup}>
                <label className={style.label}>Marca / Fabricante</label>
                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className={style.input}
                />
              </div>

              <div className={style.inputGroup}>
                <label className={style.label}>Modelo</label>
                <input
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className={style.input}
                />
              </div>

              <div className={style.inputGroup}>
                <label className={style.label}>Ano de Fabricação</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={style.input}
                />
              </div>

              <div className={style.inputGroup}>
                <label className={style.label}>Nº de Série / Patrimônio</label>
                <input
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleChange}
                  className={style.input}
                />
              </div>
            </div>

            <div className={style.inputGroupFull}>
              <label className={style.label}>Descrição Detalhada</label>
              <textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                className={`${style.input} ${style.textarea}`}
              ></textarea>
            </div>
          </div>

          <div className={style.card}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={style.cardTitle}>
                <Camera size={14} className={style.cardIcon} /> Fotos por Ângulo
                (POV)
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                Gerenciar Fotos
              </Button>
            </div>

            <div className={style.imageGrid}>
              {positionedFiles.map((pf) =>
                pf.previewUrl ? (
                  <div key={pf.position} className={style.imageItem}>
                    <img
                      src={pf.previewUrl}
                      alt={pf.position}
                      className={style.image}
                    />
                    <div className={style.imageBadge}>{pf.position}</div>
                    {pf.file && (
                      <div
                        className={style.uploadPendingBadge}
                        title="Aguardando salvar para fazer upload"
                      >
                        Pendente
                      </div>
                    )}
                  </div>
                ) : null,
              )}

              {positionedFiles.every((pf) => !pf.previewUrl) && (
                <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-gray-500">
                    Nenhuma foto selecionada. Clique em "Gerenciar Fotos".
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Status & Price */}
        <div className={style.sideColumn}>
          <div className={style.card}>
            <h3 className={style.cardTitle}>
              <Package size={14} className={style.cardIcon} /> Status
              Operacional
            </h3>

            <div className="flex flex-col gap-4">
              <div className={style.inputGroup}>
                <label className={style.label}>Estado de Conservação</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className={style.input}
                >
                  {AssetCondition.options.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>

              <div className={style.inputGroup}>
                <label className={style.label}>Status do Catálogo</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={style.input}
                >
                  {AssetStatus.options.map((stat) => (
                    <option key={stat} value={stat}>
                      {stat}
                    </option>
                  ))}
                </select>
              </div>

              <div className={style.checkboxWrapper}>
                <input
                  type="checkbox"
                  name="is_featured"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className={style.checkbox}
                />
                <label htmlFor="is_featured" className={style.checkboxLabel}>
                  Destacar Ativo na Home
                </label>
              </div>
            </div>
          </div>

          <div className={style.commercialCard}>
            <h3 className={style.cardTitle}>Comercial</h3>
            <div className={style.inputGroup}>
              <label className={style.commercialLabel}>
                Preço de Venda (R$)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={handlePriceChange}
                className={style.commercialInput}
                placeholder="0,00"
              />
            </div>
          </div>

          {id && (
            <div className={style.dangerZone}>
              <p className={style.dangerZoneTitle}>Zona de Perigo</p>
              <button
                type="button"
                onClick={handleDelete}
                className={style.deleteButton}
              >
                <Trash2 size={16} /> Excluir Registro Permanente
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Modal for Managing Photos */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
          {positionedFiles.map((pf) => (
            <div
              key={pf.position}
              className="flex flex-col gap-2 p-3 border rounded-lg bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">
                  {pf.position}
                </span>
                {pf.previewUrl && (
                  <button
                    type="button"
                    onClick={() => removeFile(pf.position)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {pf.previewUrl ? (
                <div className="relative aspect-video rounded overflow-hidden border">
                  <img
                    src={pf.previewUrl}
                    alt={pf.position}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video bg-white border-2 border-dashed rounded cursor-pointer hover:bg-gray-100 transition-colors">
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-xs text-gray-500 mt-2">
                    Selecionar Foto
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      handleFileSelect(pf.position, e.target.files[0])
                    }
                  />
                </label>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={() => setIsModalOpen(false)}>Concluído</Button>
        </div>
      </Modal>
    </div>
  );
};
