/** @jsx h */

import { h } from 'preact'

export const CartFooter = ({ totalPrice, shopUrl, checkoutUrl }) => {
  return (
    <div className="cart-footer">
      <div className="grid grid--right">
        <div className="grid__column grid__column--12 grid__column--6@sm grid__column--4@md">
          <div className="cart-footer__totals">
            <div className="cart-totals">
              <div className="cart-totals__item cart-totals__item--subtotal">
                <div className="cart-totals__label">
                  Subtotal:
                </div>
                <div className="cart-totals__amount">
                  {totalPrice}
                </div>
              </div>
            </div>
          </div>
          <div className="cart-footer__cta">
            <div className="cart-footer__checkout">
              {/* FIXME: Update */}
              <form
                action={checkoutUrl}
                method="post"
                // TODO: Make sure the following is correct
                novalidate
                className="cart-footer__checkout-form"
                data-cart="form"
              >
                <button
                  type="submit"
                  name="checkout"
                  className="button button--primary button--expand"
                  data-cart="cta"
                >Go to checkout</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
