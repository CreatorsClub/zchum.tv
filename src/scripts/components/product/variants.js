// TODO: Update variant based on the URL query variable
// FIXME: product variant URL
import { getQueryVariable, getPriceString, cssClasses } from '../../utils'

const selectors = {
  singleOption: 'data-product="single-option-selector"',
  price: 'data-product="price"',
  addToCart: 'data-product="add"',
  addToCartLabel: 'data-product="add-label"',
  variantError: 'data-product="variant-error"',
}

const strings = {
  addToCart: 'Add to cart',
  unavailable: 'Not available',
  outOfStock: 'Out of stock',
  variantOptionSoldOutSuffix: ' - SOLD OUT',
}

export class Variants {
  constructor(config) {
    this.product = config.product
    this.singleVariantProduct = this.product.variants.length === 1

    if (!this.singleVariantProduct) {
      this.onVariantChangeCallback = config.onVariantChange
      this.initVariants()
    }

    this.getSelectedVariant = this.getSelectedVariantInstance.bind(this)
    this.variantErrors = this.variantErrorsInstance.bind(this)
  }

  initVariants() {
    this.singleOptions = document.querySelectorAll(
      `[${selectors.singleOption}]`
    )

    for (let i = 0; i < this.singleOptions.length; i++) {
      this.singleOptions[i].addEventListener('change', e => {
        let selectedOption = {
          index: e.target.dataset.index,
          value: e.target.value,
        }
        // TODO: Make sure this is universal per input type
        e.target.setAttribute('checked', true)
        this.onSelectChange(selectedOption)
      })
    }

    this.currentGalleryImages = this.product.selected_or_first_available_variant.images

    this.productOptionsData = this.getProductOptionsData()

    // Initially update secondary options
    if (this.product.options.length > 1) {
      this.updateVariantOptions()
    } else {
      // FIXME: Might not be required at all once liquid is updated in the backend.
      // this.updateSingleOptionVariantsAvailability()
    }
  }

  // TODO: This could be done on Shop Renderer side
  getProductOptionsData() {
    let optionsData = {}

    // Build an object of all variant options
    for (let i = 0; i < this.product.options_with_values.length; i++) {
      let optionValues = this.product.options_with_values[i].values

      for (let j = 0; j < optionValues.length; j++) {
        if (i === 0) {
          // option1
          optionsData[optionValues[j]] = {
            available: 0,
          }
          if (this.product.options.length > 1) {
            optionsData[optionValues[j]].options = {}
          }
        } else if (i === 1) {
          // option2
          for (let key in optionsData) {
            optionsData[key].options[optionValues[j]] = {
              available: 0,
            }
            if (this.product.options.length > 2) {
              optionsData[key].options[optionValues[j]].options = {}
            }
          }
        } else if (i === 2) {
          // option3
          for (let key in optionsData) {
            for (let key2 in optionsData[key].options) {
              optionsData[key].options[key2].options[optionValues[j]] = {
                available: 0,
              }
            }
          }
        }
      }
    }

    // Fill out with the availability data
    for (let i = 0; i < this.product.variants.length; i++) {
      if (this.product.variants[i].available === true) {
        if (this.product.variants[i]['option1'] === '') {
          continue
        }
        optionsData[this.product.variants[i]['option1']].available++

        if (this.product.options.length === 2) {
          optionsData[this.product.variants[i]['option1']].options[
            this.product.variants[i]['option2']
          ].available++
        }

        if (this.product.options.length === 3) {
          optionsData[this.product.variants[i]['option1']].options[
            this.product.variants[i]['option2']
          ].options[this.product.variants[i]['option3']].available++
        }
      }
    }

    // Set the global object
    return optionsData
  }

  onSelectChange(selectedOption) {
    this.selectedVariant = this.getVariantFromOptions()

    if (this.product.options.length > 1) {
      this.updateVariantOptions(selectedOption)
    }

    if (this.selectedVariant !== false) {
      if (this.selectedVariant.available === false) {
        this.variantOutOfStock()
      } else {
        this.variantAvailable()
      }
    } else {
      // Variant does not exist at all
      // TODO: How should the gallery behave here?
      this.variantUnavailable()
    }

    // Set option selection label
    this.updateOptionSelectionLabels()

    // Set price
    this.updatePrice()

    // Clear selection errors
    // TODO: Improve
    this.clearSelectedOptionErrors(selectedOption)

    // Variant change callback
    if (this.onVariantChangeCallback !== undefined) {
      this.onVariantChangeCallback(this.selectedVariant)
    }
  }

  getUnavailableOptions(selectedOption) {
    let unavailableOptions = {}

    let selectedOptions = this.getSelectedOptions(selectedOption)

    if (Object.keys(selectedOptions).length < 1) return unavailableOptions

    // Prepare object
    for (
      let optionIndex = 1;
      optionIndex <= this.product.options.length;
      optionIndex++
    ) {
      unavailableOptions[`option${optionIndex}`] = []
    }

    // Update option inputs

    // option1
    for (let key in this.productOptionsData) {
      if (this.productOptionsData[key].available === 0) {
        unavailableOptions['option1'].push(key)
      }
    }

    // option2
    if (this.product.options.length > 1) {
      let object = this.productOptionsData[selectedOptions['option1']].options

      for (let key in object) {
        if (object[key].available === 0) {
          unavailableOptions['option2'].push(key)
        }
      }
    }

    // option3
    if (this.product.options.length > 2) {
      let object = this.productOptionsData[selectedOptions['option1']].options[
        selectedOptions['option2']
      ].options
      for (let key in object) {
        if (object[key].available === 0) {
          unavailableOptions['option3'].push(key)
        }
      }
    }

    return unavailableOptions
  }

  updateVariantOptions(selectedOption) {
    // Clear previous unavailable
    for (
      let optionIndex = 1;
      optionIndex <= this.product.options.length;
      optionIndex++
    ) {
      let optionInputs = document.querySelectorAll(
        `[data-index="option${optionIndex}"]`
      )
      if (optionInputs) {
        if (optionInputs[0].getAttribute('type') === 'radio') {
          for (let i = 0; i < optionInputs.length; i++) {
            optionInputs[i].classList.remove(cssClasses.unavailable)
          }
        } else {
          let options = optionInputs[0].querySelectorAll('option')
          for (let i = 0; i < options.length; i++) {
            options[i].classList.remove(cssClasses.unavailable)
            options[i].innerHTML = options[i].innerHTML.replace(
              strings.variantOptionSoldOutSuffix,
              ''
            )
          }
        }
      }
    }

    // Mark new unavailable
    let unavailableOptions = this.getUnavailableOptions(selectedOption)
    if (Object.keys(unavailableOptions).length < 1) return

    // Proceed
    for (let key in unavailableOptions) {
      for (let i = 0; i < unavailableOptions[key].length; i++) {
        // TODO: Improve, use singleOptions constant
        let optionInput = document.querySelector(
          `[${selectors.singleOption}][data-index="${key}"]`
        )

        if (optionInput.getAttribute('type') === 'radio') {
          optionInput = document.querySelector(
            `input[data-index='${key}'][value="${unavailableOptions[key][i]}"]`
          )
          if (optionInput) {
            optionInput.classList.add(cssClasses.unavailable)
          }
        } else {
          // Select - get the <option> with a specific value
          let singleOption = optionInput.querySelector(
            `[value="${unavailableOptions[key][i]}"]`
          )
          if (singleOption) {
            singleOption.classList.add(cssClasses.unavailable)
            singleOption.innerHTML += strings.variantOptionSoldOutSuffix
          }
        }
      }
    }
  }

  getVariantFromOptions() {
    let selectedValues = this.getCurrentOptions()
    let variants = this.product.variants
    let found = false

    for (let i = 0; i < variants.length; i++) {
      let isEqual = selectedValues.every(function(values) {
        if (variants[i][values.index] === values.value) {
          return true
        }
      })
      // TODO: Check if this can be improved
      if (isEqual) {
        found = variants[i]
        break
      }
    }

    return found
  }

  getCurrentOptions() {
    let currentOptions = []

    this.singleOptions.forEach(function(el) {
      let type = el.getAttribute('type')
      let option = {}

      if (type === 'radio' || type === 'checkbox') {
        if (el.checked) {
          option.value = el.value
          option.index = el.dataset.index
          currentOptions.push(option)
        }
      } else {
        option.value = el.value
        option.index = el.dataset.index
        currentOptions.push(option)
      }
    })

    currentOptions.filter(Boolean)

    return currentOptions
  }

  getSelectedOptions(selectedOption) {
    let selectedOptions = {}

    for (
      let optionIndex = 1;
      optionIndex <= this.product.options.length;
      optionIndex++
    ) {
      if (
        selectedOption !== undefined &&
        selectedOption.index === 'option' + optionIndex
      ) {
        selectedOptions['option' + optionIndex] = selectedOption.value
        continue
      }
      let input = document.querySelectorAll(
        `[data-index="option${optionIndex}"]`
      )
      if (input) {
        if (input[0].getAttribute('type') === 'radio') {
          input = document.querySelector(
            `[data-index="option${optionIndex}"]:checked`
          )
          if (input) {
            selectedOptions['option' + optionIndex] = input.value
          }
        } else {
          let selectedOption = input[0].querySelector('option:checked')
          if (selectedOption) {
            selectedOptions['option' + optionIndex] = selectedOption.value
          }
        }
      }
    }

    return selectedOptions
  }

  updateOptionSelectionLabels() {
    let selectedOptions = this.getSelectedOptions()

    for (
      let optionIndex = 1;
      optionIndex <= this.product.options.length;
      optionIndex++
    ) {
      let labelInput = document.querySelector(
        `[data-product="selected-option${optionIndex}-label"]`
      )
      if (labelInput) {
        labelInput.innerHTML = selectedOptions['option' + optionIndex]
      }
    }
  }

  getSelectedVariantInstance() {
    if (this.singleVariantProduct) {
      return this.product.variants[0]
    }
    return this.getVariantFromOptions()
  }

  updatePrice() {
    const price = document.querySelector(`[${selectors.price}]`)

    if (this.selectedVariant === false) {
      price.innerHTML = strings.unavailable
    } else {
      // TODO: Shopify legacy
      if (this.selectedVariant.price.cents !== undefined) {
        price.innerHTML = getPriceString(this.selectedVariant.price.cents)
      } else {
        price.innerHTML = getPriceString(this.selectedVariant.price)
      }
    }
  }

  // TODO: Improve
  clearSelectedOptionErrors(selectedOption) {
    let errorElems = document.querySelector(
      `[${selectors.variantError}][data-variant-error="${selectedOption.index}"]`
    )
    if (errorElems !== null) {
      errorElems.classList.remove(cssClasses.visible)
    }
  }

  updateAddToCartButton(enabled, label) {
    const button = document.querySelector(`[${selectors.addToCart}]`)

    if (label !== undefined) {
      button.querySelector(`[${selectors.addToCartLabel}]`).innerHTML = label
    }

    if (enabled === false) {
      button.setAttribute('disabled', 'disabled')
      button.classList.remove(cssClasses.disabled)
    } else {
      button.removeAttribute('disabled')
      button.classList.add(cssClasses.disabled)
    }
  }

  variantAvailable() {
    this.updateAddToCartButton(true, strings.addToCart)
  }

  variantUnavailable() {
    this.updateAddToCartButton(false, strings.unavailable)
  }

  variantOutOfStock() {
    this.updateAddToCartButton(false, strings.outOfStock)
  }

  getVariantErrors() {
    const notSelectedOptions = []
    for (let j = 1; j <= this.product.options.length; j++) {
      let options = document.querySelectorAll(
        `[${selectors.singleOption}][data-index="option${j}"]`
      )
      if (options.length === 1) {
        if (options.value === null) {
          notSelectedOptions.push('option' + j)
        }
      } else if (options.length > 0) {
        let selectedOption = document.querySelector(
          `[${selectors.singleOption}][data-index="option${j}"]:checked`
        )
        if (selectedOption === null) {
          notSelectedOptions.push('option' + j)
        }
      }
    }
    return notSelectedOptions
  }

  clearVariantErrors() {
    const errorElems = document.querySelectorAll(`[${selectors.variantError}]`)
    for (let i = 0; i < errorElems.length; i++) {
      errorElems[i].classList.remove(cssClasses.visible)
    }
  }

  showVariantErrors(errors) {
    for (let i = 0; i < errors.length; i++) {
      let errorElem = document.querySelector(
        `[${selectors.variantError}][data-variant-error="${errors[i]}"]`
      )
      if (errorElem !== null) {
        errorElem.classList.add(cssClasses.visible)
      }
    }
  }

  variantErrorsInstance() {
    if (this.singleVariantProduct) {
      return false
    }

    this.clearVariantErrors()
    let variantErrors = this.getVariantErrors()
    if (variantErrors.length > 0) {
      this.showVariantErrors(variantErrors)
      return true
    }
    return false
  }
}
