import type { Asset } from "../../../schemas/entities";

/**
 * Custom hook to handle WhatsApp contact functionality
 * Generates formatted message and opens WhatsApp with asset details
 */
export const useWhatsAppContact = () => {
  const whatsappNumber = "55319XXXXXXXX"; // TODO: Move to config/env

  const generateMessage = (asset: Asset): string => {
    const currentUrl = window.location.href;
    return `Olá! Tenho interesse no seguinte equipamento do catálogo Valemix Ativos:

📋 *${asset.name}*
🏷️ Categoria: ${asset.category}
🏭 Marca/Modelo: ${asset.brand} ${asset.model}
📅 Ano: ${asset.year}
🔗 Link: ${currentUrl}

Poderia me passar mais informações sobre disponibilidade e valor?`;
  };

  const openWhatsApp = (asset: Asset) => {
    const message = generateMessage(asset);
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      "_blank",
    );
  };

  return {
    openWhatsApp,
  };
};
