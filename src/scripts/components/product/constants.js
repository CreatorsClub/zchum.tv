import { isMobile } from '../../utils'

const dataPrefix = 'data-gallery'
const swipeAngle = 40

export const mainSelectors = {
  main: `[${dataPrefix}="gallery"]`,
  item: `[${dataPrefix}="gallery-slide"]`,
  navPrev: `[${dataPrefix}="nav-prev"]`,
  navNext: `[${dataPrefix}="nav-next"]`,
  imgHolder: `[${dataPrefix}="gallery-img-holder"]`
}

export const thumbnailsSelectors = {
  main: `[${dataPrefix}="thumbnails"]`,
  item: `[${dataPrefix}="thumbnail"]`,
  navPrev: `[${dataPrefix}="thumbnails-nav-prev"]`,
  navNext: `[${dataPrefix}="thumbnails-nav-next"]`
}

export const mainConfig = {
  container: mainSelectors.main,
  items: 1,
  slideBy: 1,
  autoplay: false,
  mouseDrag: isMobile.any ? true : false,
  controls: true,
  controlsContainer: false,
  prevButton: mainSelectors.navPrev,
  nextButton: mainSelectors.navNext,
  nav: true,
  loop: false,
  navContainer: thumbnailsSelectors.main,
  navAsThumbnails: true,
  swipeAngle: swipeAngle,
  preventScrollOnTouch: 'auto'
}

export const thumbnailsConfig = {
  container: thumbnailsSelectors.main,
  items: 4,
  axis: 'horizontal',
  responsive: {
    680: {
      items: 6
    },
    1024: {
      axis: 'vertical',
      autoWidth: true
    }
  },
  slideBy: 1,
  autoplay: false,
  mouseDrag: isMobile.any ? true : false,
  controls: true,
  controlsContainer: false,
  prevButton: thumbnailsSelectors.navPrev,
  nextButton: thumbnailsSelectors.navNext,
  nav: false,
  loop: false,
  swipeAngle: swipeAngle,
  preventScrollOnTouch: 'auto'
}
