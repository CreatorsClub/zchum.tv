import { cssClasses } from '../utils'
const selectSelector = '[data-select="container"]'

function extendSelect(select) {
  const input = document.querySelector(`[data-select-input="${select.dataset.triggerInput}"]`)

  select.addEventListener('change', event => onChange(event))

  function onChange(event) {
    if (event.target.value === 'more') {
      event.target.classList.add(cssClasses.hidden)
      input.classList.remove(cssClasses.hidden)
      input.focus()
    }
  }
}

export default () => {
  const selects = document.querySelectorAll(selectSelector)
  for (let i = 0; i < selects.length; i++) {
    extendSelect(selects[i])
  }
}
