import { create } from "zustand";

/**
 * =============================================================================
 * TOAST STORE
 * =============================================================================
 *
 * Manages global toast notification state independently of authentication.
 * Extracted from useAuthStore to follow the Single Responsibility Principle —
 * toast notifications are a UI concern, not an authentication concern.
 *
 * LIMITATION: Only one toast is shown at a time.
 * For multiple simultaneous notifications, consider implementing a queue.
 */

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastState {
  /** The message to display to the user */
  message: string;
  /** The type/severity of the notification */
  type: ToastType;
  /** Whether the toast is currently visible */
  visible: boolean;
}

interface ToastStore {
  toast: ToastState;
  /**
   * Display a toast notification.
   *
   * @param message  - The message to display
   * @param type     - Notification severity (default: "info")
   * @param duration - Auto-hide delay in ms (default: 3000)
   */
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  /** Hide the current toast immediately */
  hideToast: () => void;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialToast: ToastState = {
  message: "",
  type: "info",
  visible: false,
};

// =============================================================================
// STORE IMPLEMENTATION
// =============================================================================

export const useToastStore = create<ToastStore>()((set, get) => ({
  toast: initialToast,

  showToast: (
    message: string,
    type: ToastType = "info",
    duration: number = 3000,
  ) => {
    set({ toast: { message, type, visible: true } });

    setTimeout(() => {
      // Only auto-hide if this toast hasn't been replaced in the meantime
      if (get().toast.message === message) {
        set({ toast: initialToast });
      }
    }, duration);
  },

  hideToast: () => {
    set({ toast: initialToast });
  },
}));