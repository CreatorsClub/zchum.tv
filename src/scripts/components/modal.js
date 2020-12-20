// import setBodyScrolling from './scroll-blocker'

const MODAL_SELECTOR = 'data-modal'
const OPEN_SELECTOR = 'data-modal-open'
const CLOSE_SELECTOR = 'data-modal-close'

const MODAL_VISIBLE_CLASS = 'modal--visible'

export function open(targetName) {
  const modal = document.querySelector(`[${MODAL_SELECTOR}="${targetName}"]`)
  const style = window.getComputedStyle(modal)

  if (style.getPropertyValue('display') !== 'none') {
    modal.classList.add(MODAL_VISIBLE_CLASS)
    // setBodyScrolling(false)
  }
}

export function close(targetName) {
  const modal = document.querySelector(`[${MODAL_SELECTOR}="${targetName}"]`)
  const style = window.getComputedStyle(modal)

  if (style.getPropertyValue('display') !== 'none') {
    modal.classList.remove(MODAL_VISIBLE_CLASS)
    setBodyScrolling(true)
  }
}

export default function() {
  const openButtons = document.querySelectorAll(`[${OPEN_SELECTOR}]`)
  const closeButtons = document.querySelectorAll(`[${CLOSE_SELECTOR}]`)

  for (let i = 0; i < openButtons.length; i++) {
    openButtons[i].addEventListener('click', function(event) {
      event.preventDefault()

      const targetName = this.getAttribute(OPEN_SELECTOR)
      open(targetName)
    })
  }

  for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener('click', function(event) {
      event.preventDefault()

      const targetName = this.getAttribute(CLOSE_SELECTOR)
      close(targetName)
    })
  }
}
