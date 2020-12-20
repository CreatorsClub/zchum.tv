import { tns } from 'tiny-slider/src/tiny-slider'
import { cssClasses } from '../utils'

export class Carousel {
  constructor({ selectors, config = {} }) {
    this.sliderDOMElement = document.querySelector(selectors.main)

    if (!this.sliderDOMElement) {
      throw new Error(
        `DOM Element with selector :: ${selectors.main} doesn't exist or it's value is equal null.`
      )
    }

    this.config = config
    this.selectors = selectors
    this.itemTemplate = this.setItemTemplate()
    this.instance = tns(this.config)

    this.rebuild = this.rebuildInstance.bind(this)
  }

  detroyInstance() {
    this.instance.destroy()
  }

  setItemTemplate() {
    const el = document.querySelector(this.selectors.item).cloneNode(true)
    el.querySelector('img').setAttribute('src', '')
    if (el.querySelector(this.selectors.imgHolder)) {
      el.querySelector(this.selectors.imgHolder).dataset.zoomImage = ''
      el.querySelector(this.selectors.imgHolder).dataset.zoomImageLoaded = ''
    }

    return el
  }

  rebuildInstance(images) {
    if (!images) {
      return
    }

    this.detroyInstance()

    this.sliderDOMElement = document.querySelector(this.selectors.main)
    this.sliderDOMElement.classList.add(cssClasses.loading)

    const tempContainer = document.createDocumentFragment()

    for (let i = 0; i < images.length; i++) {
      let slide = this.itemTemplate.cloneNode(true)
      slide.querySelector('img').setAttribute('src', images[i])
      slide.dataset.galleryItemIndex = i
      let imgHolder = slide.querySelector(this.selectors.imgHolder)
      if (imgHolder) {
        imgHolder.dataset.zoomImage = images[i]
      }
      tempContainer.appendChild(slide)
    }

    this.sliderDOMElement.innerHTML = ''
    this.sliderDOMElement.appendChild(tempContainer)
    this.instance = tns(this.config)
  }
}
