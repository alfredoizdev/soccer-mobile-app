import Toast from 'react-native-toast-message'

export class ToastService {
  /**
   * Show success message
   */
  static success(message: string, description?: string) {
    Toast.show({
      type: 'success',
      text1: message,
      text2: description,
      position: 'top',
      visibilityTime: 3000,
    })
  }

  /**
   * Show error message
   */
  static error(message: string, description?: string) {
    Toast.show({
      type: 'error',
      text1: message,
      text2: description,
      position: 'top',
      visibilityTime: 4000,
    })
  }

  /**
   * Show info message
   */
  static info(message: string, description?: string) {
    Toast.show({
      type: 'info',
      text1: message,
      text2: description,
      position: 'top',
      visibilityTime: 3000,
    })
  }

  /**
   * Show custom toast with NativeWind styling
   */
  static custom(message: string, description?: string) {
    Toast.show({
      type: 'custom',
      text1: message,
      text2: description,
      position: 'top',
      visibilityTime: 3000,
    })
  }

  /**
   * Hide current toast
   */
  static hide() {
    Toast.hide()
  }
}

// Export convenience methods
export const showSuccess = ToastService.success
export const showError = ToastService.error
export const showInfo = ToastService.info
export const showCustom = ToastService.custom