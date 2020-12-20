/** @jsx h */

import { render, h, createContext } from 'preact'
import { useState, useEffect } from 'preact/hooks'

import { CartContainer } from './CartContainer'

const cartComponentSelector = '#cart-component'
export const CartStore = createContext(false)

export const cart = () => {
  // TODO: Make sure the function fires on the cart page only.
  let cartComponent = document.querySelector(cartComponentSelector)
  if (!cartComponent) return
  const CartApp = () => {
    const [modalActive, setModalActive] = useState(false)
    const [modalContent, setModalContent] = useState({
      name: '',
      callback: null,
    })

    const initialStore = {
      modal: {
        active: modalActive,
        setActive: setModalActive,
        content: modalContent,
        setContent: setModalContent,
      },
    }

    return (
      <CartStore.Provider value={initialStore}>
        <CartContainer />
      </CartStore.Provider>
    )
  }

  render(<CartApp />, cartComponent)
}
