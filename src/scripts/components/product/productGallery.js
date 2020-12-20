import { Carousel } from '../Carousel'
import { ImageZoom } from '../ImageZoom'
import {
  mainSelectors,
  mainConfig,
  thumbnailsSelectors,
  thumbnailsConfig,
} from './constants'

export class ProductGallery {
  constructor(config) {
    this.currentGalleryImages = config.selectedVariant.images

    this.thumbnailsGallery = new Carousel({
      selectors: thumbnailsSelectors,
      config: thumbnailsConfig,
    })

    this.productGallery = new Carousel({
      selectors: mainSelectors,
      config: mainConfig,
    })

    this.setCarouselIndexChangedCallback()

    this.buildGalleryZoom()

    this.updateImagesByVariant = this.updateImagesByVariantInstance.bind(this)
  }

  updateImages(images) {
    this.thumbnailsGallery.rebuild(images)
    this.productGallery.rebuild(images)
    this.setCarouselIndexChangedCallback()
    this.rebuildGalleryZoom()
  }

  updateImagesByVariantInstance(variant) {
    if (!variant.images || variant.images.length < 1) return

    if (
      this.currentGalleryImages !== undefined &&
      variant.images !== undefined &&
      variant.images.length === this.currentGalleryImages.length
    ) {
      let sameGallery = true
      for (let i = 0; i < variant.images.length; i++) {
        if (variant.images[i].src !== this.currentGalleryImages[i].src) {
          sameGallery = false
          break
        }
      }
      if (sameGallery) return
    }

    this.currentGalleryImages = variant.images

    let newImages = []
    for (let i = 0; i < variant.images.length; i++) {
      newImages.push(variant.images[i].src)
    }

    this.updateImages(newImages)
  }

  setCarouselIndexChangedCallback() {
    this.productGallery.instance.events.on('indexChanged', evt =>
      this.carouselIndexChangedCallback(evt)
    )
  }

  carouselIndexChangedCallback() {
    this.thumbnailsGallery.instance.goTo(
      this.productGallery.instance.getInfo().displayIndex - 2
    )
  }

  buildGalleryZoom() {
    this.imageZoom = new ImageZoom({
      selector: mainSelectors.imgHolder,
    })
  }

  rebuildGalleryZoom() {
    this.imageZoom.rebuild()
  }
}
