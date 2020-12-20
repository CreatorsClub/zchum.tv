/** @jsx h */

import { h } from 'preact'

export const CartHeader = ({ itemCount, totalPrice }) => {

  let itemCountLabel = (itemCount === 1) ? 'item' : 'items'

  return (
    <div className="cart-header">
      <h1 className="cart-header__heading">
        Your Shopping Cart
      </h1>
      <h2 className="cart-header__summary">
        <span class="highlight">{itemCount}</span> {itemCountLabel} in your cart for <span class="highlight">{totalPrice}</span>
      </h2>
    </div>
  )
}
