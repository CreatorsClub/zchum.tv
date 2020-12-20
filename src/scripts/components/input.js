const containerSelector = 'data-input="container"'
const inputSelector = 'data-input="input"'

export function setInputFocus() {
  let containers = document.querySelectorAll(`[${containerSelector}]`)

  for (let i = 0; i < containers.length; i++) {
    containers[i].addEventListener('click', e => {
      if (e.target.dataset.input === 'container') {
        e.target.querySelector('input').focus()
      }
    })
  }
}

export default function() {
  let containers = document.querySelectorAll(`[${containerSelector}]`)

  for (let i = 0; i < containers.length; i++) {
    let input = containers[i].querySelector(`[${inputSelector}]`)

    if (input.value !== '') {
      input.classList.add('input__input--filled')
    } else {
      input.classList.remove('input__input--filled')
    }

    input.addEventListener('blur', () => {
      if (input.value !== '') {
        input.classList.add('input__input--filled')
      } else {
        input.classList.remove('input__input--filled')
      }
    })
  }

  setInputFocus()
}
