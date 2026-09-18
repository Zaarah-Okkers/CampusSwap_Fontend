// Shared SweetAlert2 theming so every confirmation/success/error dialog
// looks native to CampusSwap (navy/ink background, gold accents) instead
// of using the SweetAlert defaults.
import Swal from 'sweetalert2'

export const swalTheme = Swal.mixin({
  background: '#12173F',
  color: '#F4F2FF',
  confirmButtonColor: '#E8B54D',
  cancelButtonColor: 'rgba(244, 242, 255, 0.12)',
  customClass: {
    popup: 'cs-swal-popup',
    title: 'cs-swal-title',
    confirmButton: 'cs-swal-confirm',
    cancelButton: 'cs-swal-cancel'
  },
  buttonsStyling: true,
  reverseButtons: true
})

/**
 * Standard confirm -> async action -> success/error flow used across the
 * payment, move-out, residence-request, extension and safety-report actions.
 *
 * @param {Object} options
 * @param {string} options.confirmTitle
 * @param {string} options.confirmText
 * @param {string} options.confirmButtonText
 * @param {string} [options.icon] - icon for the confirm step (default 'question')
 * @param {string} options.successTitle
 * @param {string} options.successText
 * @param {() => Promise<any>|any} options.action - runs after the user confirms
 * @returns {Promise<boolean>} whether the action ran and succeeded
 */
export async function confirmThenRun({
  confirmTitle,
  confirmText,
  confirmButtonText = 'Confirm',
  icon = 'question',
  successTitle,
  successText,
  action
}) {
  const result = await swalTheme.fire({
    title: confirmTitle,
    text: confirmText,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancel',
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !Swal.isLoading(),
    preConfirm: async () => {
      try {
        return await action()
      } catch (err) {
        Swal.showValidationMessage(err?.message || 'Something went wrong. Please try again.')
        return false
      }
    }
  })

  if (!result.isConfirmed || result.value === false) return false

  await swalTheme.fire({
    title: successTitle,
    text: successText,
    icon: 'success'
  })
  return true
}

export function swalError(title, text) {
  return swalTheme.fire({ title, text, icon: 'error' })
}

export default swalTheme