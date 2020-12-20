import { getPriceString, cssClasses, setCartWidgetQuantity } from '../../utils'
import { toggleDrawer } from '../drawer'
import { Variants } from './variants'
import { ProductGallery } from './productGallery'
import { cartService } from '../../utils/cartService'

const selectors = {
  quantity: 'data-product="qty"',
  cta: 'data-product="add"',
  recommendedAdd: 'data-product="recommended-add"',
  quantityError: 'data-product="qty-error"',
  drawerImg: 'data-product-info="img"',
  priceInfo: 'data-product-info="price"',
  titleInfo: 'data-product-info="title"',
  quantityInfo: 'data-product-info="qty"',
  quantityCartInfo: 'data-product-info="cart-qty"',
  priceCartInfo: 'data-product-info="cart-price"',
}

const strings = {
  errorOutOfStock: 'Out of stock.',
  errorQuantity: 'Please, insert quantity.',
}

export class Product {
  constructor() {
    this.productObj = this.getProduct()
    if (this.productObj) {
      this.productGallery = new ProductGallery({
        selectedVariant: this.productObj.selected_or_first_available_variant,
      })

      this.variants = new Variants({
        product: this.productObj,
        onVariantChange: this.variantChangeCallback.bind(this),
      })

      this.initAddButtons()
      this.initRecommended()
    }
  }

  variantChangeCallback(variant) {
    this.productGallery.updateImagesByVariant(variant)
  }

  getProduct() {
    if (document.getElementById('product-json')) {
      return JSON.parse(document.getElementById('product-json').innerHTML)
    }
    return false
  }

  initAddButtons() {
    const addButtons = document.querySelectorAll(`[${selectors.cta}]`)
    const quantityErrorElem = document.querySelector(
      `[${selectors.quantityError}]`
    )

    for (let i = 0; i < addButtons.length; i++) {
      addButtons[i].addEventListener('click', (e) => {
        e.preventDefault()
        let button = e.currentTarget

        if (this.variants.variantErrors()) {
          return
        }

        let selectedVariant = this.variants.getSelectedVariant()
        let quantity = this.getQuantityFromInput()

        if (quantity === '' || isNaN(quantity)) {
          quantityErrorElem.innerHTML = strings.errorQuantity
          quantityErrorElem.classList.add(cssClasses.visible)
          return
        }

        quantityErrorElem.classList.remove(cssClasses.visible)
        button.classList.add(cssClasses.loading)
        button.disabled = true

        this.addProduct(
          [{ id: selectedVariant.id, quantity: parseInt(quantity) }],
          () => {
            button.disabled = false
            toggleDrawer('product')
            button.classList.remove(cssClasses.loading)
          }
        )
      })
    }
  }

  initRecommended() {
    const recommendedAddButtons = document.querySelectorAll(
      `[${selectors.recommendedAdd}]`
    )

    for (let i = 0; i < recommendedAddButtons.length; i++) {
      recommendedAddButtons[i].addEventListener('click', (e) => {
        e.preventDefault()
        let button = e.currentTarget
        let variant = button.dataset.recommendedVariant
        let quantity = button.dataset.recommendedQuantity

        button.classList.add(cssClasses.loading)
        button.disabled = true

        this.addProduct([{ id: variant, quantity: parseInt(quantity) }], () => {
          button.classList.add(cssClasses.hidden)
          button.nextElementSibling.classList.remove(cssClasses.hidden)
        })
      })
    }
  }

  addProduct(items, callback) {
    cartService
      .addToCart(items)
      .then((response) => {
        this.updateDrawerDetails(response.data)
        setCartWidgetQuantity(response.data.cart.item_count)
        callback()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  updateDrawerDetails(data) {
    const item = data.items[0]

    const titleInfo = document.querySelector(`[${selectors.titleInfo}]`)
    const priceInfo = document.querySelector(`[${selectors.priceInfo}]`)
    const quantityInfo = document.querySelector(`[${selectors.quantityInfo}]`)
    const drawerImg = document.querySelector(`[${selectors.drawerImg}]`)
    const quantityCartInfo = document.querySelector(
      `[${selectors.quantityCartInfo}]`
    )
    const priceCartInfo = document.querySelector(`[${selectors.priceCartInfo}]`)

    if (titleInfo) {
      titleInfo.innerHTML = item.title
    }

    if (priceInfo) {
      priceInfo.innerHTML = getPriceString(item.final_price)
    }

    if (quantityInfo) {
      quantityInfo.innerHTML = item.quantity
    }

    if (drawerImg) {
      drawerImg.src = item.image
    }

    if (quantityCartInfo) {
      quantityCartInfo.innerHTML = `${data.cart.item_count} ${
        data.cart.item_count > 1 ? 'items' : 'item'
      }`
    }

    if (priceCartInfo) {
      priceCartInfo.innerHTML = getPriceString(data.cart.items_subtotal_price)
    }
  }

  getQuantityFromInput() {
    const quantityElem = document.querySelector(`[${selectors.quantity}]`)

    let quantity = quantityElem.options[quantityElem.selectedIndex].value

    if (quantity === 'more') {
      let inputQuantity = document.querySelector(
        `[data-select-input="${quantityElem.dataset.triggerInput}"]`
      )
      quantity = inputQuantity.value
    }

    return quantity
  }
}
