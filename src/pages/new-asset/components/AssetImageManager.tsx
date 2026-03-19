import React, { useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import Modal from "../../../components/modal/Modal";
import type { PositionedFile } from "../hooks/useImageManagement";
import style from "../AssetForm.module.css";

interface AssetImageManagerProps {
  positionedFiles: PositionedFile[];
  onFileSelect: (position: string, file: File) => void;
  onRemoveFile: (position: string) => void;
}

/**
 * Image management component with grid view and modal
 * Handles photo uploads organized by position/angle (POV)
 * Optimized for responsiveness with proper constraints
 */
export const AssetImageManager: React.FC<AssetImageManagerProps> = ({
  positionedFiles,
  onFileSelect,
  onRemoveFile,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const uploadedCount = positionedFiles.filter((pf) => pf.previewUrl).length;
  const totalCount = positionedFiles.length;

  return (
    <>
      <div className={style.card}>
        {/* Header - Responsive flex that stacks on mobile */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <div className="flex flex-col gap-1">
            <h3 className={style.cardTitle}>
              <Camera size={14} className={style.cardIcon} /> Fotos por Ângulo
              (POV)
            </h3>
            <span className="text-xs text-gray-400 font-medium">
              {uploadedCount} / {totalCount} ângulos preenchidos
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto"
          >
            Gerenciar Fotos
          </Button>
        </div>

        {/* Image Grid - Responsive from 2 to 3 to 4 columns */}
        <div className={style.imageGrid}>
          {positionedFiles.map((pf) =>
            pf.previewUrl ? (
              <div key={pf.position} className={style.imageItem}>
                <img
                  src={pf.previewUrl}
                  alt={`Foto do ativo - ${pf.position}`}
                  className={style.image}
                  loading="lazy"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectPosition: "center",
                  }}
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

          {/* Empty State - Better responsive padding */}
          {positionedFiles.every((pf) => !pf.previewUrl) && (
            <div className="col-span-full py-12 sm:py-16 px-4 text-center border-2 border-dashed border-gray-200 rounded-lg">
              <Upload className="mx-auto text-gray-400 mb-3" size={40} />
              <p className="text-gray-500 text-sm sm:text-base">
                Nenhuma foto selecionada. Clique em "Gerenciar Fotos".
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Improved responsive layout and padding */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4 sm:p-6 max-w-[95vw] sm:max-w-[90vw] lg:max-w-6xl xl:max-w-7xl mx-auto max-h-[85vh] overflow-y-auto">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-2 -mt-2">
            Gerenciar Fotos do Ativo
          </h2>

          {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-2">
            {positionedFiles.map((pf) => (
              <div
                key={pf.position}
                className="flex flex-col gap-3 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {/* Position Header */}
                <div className="flex justify-between items-center min-h-[24px]">
                  <span className="font-semibold text-gray-700 text-sm">
                    {pf.position}
                  </span>
                  {pf.previewUrl && (
                    <button
                      type="button"
                      onClick={() => onRemoveFile(pf.position)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Remover foto"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* Image Preview or Upload Area - Square aspect ratio for consistency */}
                {pf.previewUrl ? (
                  <div className="relative aspect-square rounded overflow-hidden border-2 border-gray-300 min-h-[200px] max-h-[350px]">
                    <img
                      src={pf.previewUrl}
                      alt={`Preview - ${pf.position}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      style={{
                        maxWidth: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {pf.file && (
                      <div className="absolute bottom-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                        Nova
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-square min-h-[200px] max-h-[350px] bg-white border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all">
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500 font-medium px-4 text-center">
                      Clique para selecionar
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      JPG, PNG até 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Basic file size validation (10MB)
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

          {/* Footer - Better spacing with sticky positioning */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-6 pt-4 border-t border-gray-200 sticky bottom-0 bg-white/95 backdrop-blur-sm -mb-2 pb-2">
            <span className="text-sm text-gray-600">
              {uploadedCount} de {totalCount} fotos adicionadas
            </span>
            <Button onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">
              Concluído
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
