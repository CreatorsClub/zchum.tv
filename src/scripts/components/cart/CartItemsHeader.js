/** @jsx h */

import { h } from 'preact'

export const CartItemsHeader = () => {
  return (
    <div className="cart-items-header">
      <div className="cart-items-header__section cart-items-header__section--item">
        Item
      </div>
      <div className="cart-items-header__section cart-items-header__section--quantity">
        Quantity
      </div>
      <div className="cart-items-header__section cart-items-header__section--price">
        Price
      </div>
      <div className="cart-items-header__section cart-items-header__section--remove" />
    </div>
  )
}
