import isMobileFunction from 'ismobilejs'
export const isMobile = isMobileFunction()

export function getQueryVariable(variable) {
  let query = window.location.search.substring(1)
  let vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=')

    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return false
}

export function getPriceString(amount) {
  return '$' + (amount / 100).toFixed(2)
}

export function pluralize(value, singular, plural) {
  if (value === 1) {
    return singular
  } else {
    return plural
  }
}

export function setCartWidgetQuantity(qty) {
  const cartWidgetQtySelector = 'data-cart-widget="qty"'
  const cartWidgetQty = document.querySelectorAll(`[${cartWidgetQtySelector}]`)

  for (let i = 0; i < cartWidgetQty.length; i++) {
    cartWidgetQty[i].innerHTML = qty
    if (parseInt(qty) === 0) {
      cartWidgetQty[i].parentElement.classList.add(cssClasses.empty)
    } else {
      cartWidgetQty[i].parentElement.classList.remove(cssClasses.empty)
    }
  }
}

export const cssClasses = {
  loading: 'is-loading',
  hidden: 'hidden',
  active: 'is-active',
  visible: 'is-visible',
  empty: 'is-empty',
  unavailable: 'is-unavailable',
  disabled: 'is-disabled',
  paused: 'is-paused'
}
