import React, { useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import Modal from "../../../components/modal/Modal";
import { AssetImage } from "../../../components/ui/AssetImage";
import type { PositionedFile } from "../hooks/useImageManagement";
import style from "./AssetComponents.module.css";

interface AssetImageManagerProps {
  positionedFiles: PositionedFile[];
  isLoadingImages?: boolean;
  onFileSelect: (position: string, file: File) => void;
  onRemoveFile: (position: string) => void;
  onToggleMain: (position: string) => void;
}

/**
 * Image management component with grid view and modal.
 * Uses AssetImage for all rendering so that backend image paths
 * are resolved via the static file serving flow (/images/),
 * while local blob: preview URLs are passed through unchanged.
 */
export const AssetImageManager: React.FC<AssetImageManagerProps> = ({
  positionedFiles,
  isLoadingImages = false,
  onFileSelect,
  onRemoveFile,
  onToggleMain,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const uploadedCount = positionedFiles.filter((pf) => pf.previewUrl).length;
  const totalCount = positionedFiles.length;

  return (
    <>
      <div className={style.card}>
        <div className={style.cardHeader}>
          <div className={style.cardHeaderInfo}>
            <h3 className={style.cardTitle}>
              <Camera size={14} className={style.cardIcon} /> Fotos por Ângulo
              (POV)
            </h3>
            <span className={style.cardCounter}>
              {isLoadingImages
                ? "Carregando fotos…"
                : `${uploadedCount} / ${totalCount} ângulos preenchidos`}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className={style.cardHeaderButton}
          >
            Gerenciar Fotos
          </Button>
        </div>

        <div className={style.imageGrid}>
          {/* Skeleton tiles while fetching existing images */}
          {isLoadingImages
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`${style.imageItem} ${style.skeleton}`} />
              ))
            : positionedFiles.map((pf) =>
                pf.previewUrl ? (
                  <div key={pf.position} className={style.imageItem}>
                    {/* AssetImage resolves both blob: URLs and backend paths */}
                    <AssetImage
                      src={pf.previewUrl}
                      alt={`Foto do ativo - ${pf.position}`}
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

          {!isLoadingImages && positionedFiles.every((pf) => !pf.previewUrl) && (
            <div className={style.emptyState}>
              <Upload className={style.emptyStateIcon} size={40} />
              <p className={style.emptyStateText}>
                Nenhuma foto selecionada. Clique em "Gerenciar Fotos".
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={style.modalContent}>
          <h2 className={style.modalHeader}>Gerenciar Fotos do Ativo</h2>

          <div className={style.modalGrid}>
            {positionedFiles.map((pf) => (
              <div key={pf.position} className={style.positionCard}>
                <div className={style.positionHeader}>
                  <span className={style.positionLabel}>{pf.position}</span>
                  {pf.previewUrl && (
                    <button
                      type="button"
                      onClick={() => onRemoveFile(pf.position)}
                      className={style.removeButton}
                      title="Remover foto"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {pf.previewUrl ? (
                  <>
                    <div className={style.imagePreview}>
                      {/* AssetImage handles both local blob: and backend paths */}
                      <AssetImage
                        src={pf.previewUrl}
                        alt={`Preview - ${pf.position}`}
                        className={style.previewImage}
                      />
                      {pf.file && (
                        <div className={style.newBadge}>Nova</div>
                      )}
                    </div>
                    <div className={style.mainImageSelect}>
                      <input
                        type="radio"
                        id={`main-${pf.position}`}
                        name="main-image"
                        checked={pf.isMain}
                        onChange={() => onToggleMain(pf.position)}
                      />
                      <label htmlFor={`main-${pf.position}`}>Usar como Principal</label>
                    </div>
                  </>
                ) : (
                  <label className={style.uploadArea}>
                    <Upload size={32} className={style.uploadIcon} />
                    <span className={style.uploadLabel}>
                      Clique para selecionar
                    </span>
                    <span className={style.uploadHint}>JPG, PNG até 10MB</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className={style.uploadInput}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) {
                            alert("Arquivo muito grande. Máximo: 10MB");
                            return;
                          }
                          onFileSelect(pf.position, file);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>

          <div className={style.modalFooter}>
            <span className={style.footerCounter}>
              {uploadedCount} de {totalCount} fotos adicionadas
            </span>
            <Button onClick={() => setIsModalOpen(false)}>Concluído</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
