import { cssClasses } from '../utils'

const drawerSelector = 'data-drawer'
const triggerSelector = 'data-drawer-trigger'

export function toggleDrawer(targetName) {
  let drawer = document.querySelector(`[${drawerSelector}="${targetName}"]`)
  drawer.classList.toggle(cssClasses.visible)

  if (drawer.classList.contains(cssClasses.visible)) {
    // setBodyScrolling(false)
  } else {
    // setBodyScrolling(true)
  }
}

export default function() {
  let triggers = document.querySelectorAll(`[${triggerSelector}]`)

  for (let i = 0; i < triggers.length; i++) {
    triggers[i].addEventListener('click', function(event) {
      event.preventDefault()

      let targetName = this.getAttribute(triggerSelector)
      toggleDrawer(targetName)
    })
  }
}
