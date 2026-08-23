import { toast, ToastPosition } from 'react-toastify';

export type ToastPositionOption =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type ToastTheme = 'dark' | 'light';

interface IToastOptions {
  position?: ToastPositionOption;
  theme?: ToastTheme;
}

function toLibraryPosition(
  position?: ToastPositionOption,
): ToastPosition | undefined {
  return position;
}

function toContainerId(theme: ToastTheme = 'light') {
  return theme;
}

export function showSuccessToast(message: string, options?: IToastOptions) {
  toast.success(message, {
    position: toLibraryPosition(options?.position),
    containerId: toContainerId(options?.theme),
  });
}

export function showErrorToast(message: string, options?: IToastOptions) {
  toast.error(message, {
    position: toLibraryPosition(options?.position),
    containerId: toContainerId(options?.theme),
  });
}
