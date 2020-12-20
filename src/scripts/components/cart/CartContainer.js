/** @jsx h */

import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'

import { cartService } from '../../utils/cartService'
import { CartStore } from './index'
import { CartHeader } from './CartHeader'
import { CartItemsHeader } from './CartItemsHeader'
import { CartFooter } from './CartFooter'
import { CartItem } from './CartItem'
import { Modal } from '../modal/Modal'
import { cssClasses } from '../../utils'

import { getPriceString, setCartWidgetQuantity } from '../../utils'

const Cart = ({
  modalContent,
  modalActive,
  setModalContent,
  setModalActive,
}) => {
  const [cartLoaded, setCartLoaded] = useState(false)
  const [price, setTotalPrice] = useState(null)
  const [items, setItems] = useState(null)
  const [itemCount, setItemCount] = useState(null)
  const [cartLoading, setCartLoading] = useState(false)

  // FIXME: Update: maybe a good idea to put it in the GetCart ajax response?
  const checkoutUrl = '/cart'

  useEffect(() => {
    cartService
      .getCart()
      .then(response => {
        setItems(response.data.items)
        setItemCount(response.data.item_count)
        setTotalPrice(response.data.total_price)
        setCartLoaded(true)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const renderItem = ({
    id,
    images,
    product_title,
    variant_title,
    price,
    quantity,
    url,
  }) => (
    <CartItem
      id={id}
      image={images[0].url}
      productTitle={product_title}
      variantTitle={variant_title}
      price={getPriceString(price)}
      quantity={quantity}
      url={url}
      onQuantityChange={handleOnQuantityChange}
    />
  )

  const handleOnQuantityChange = (quantity, id, name) => {
    if (quantity === 0) {
      setModalContent({
        name,
        callback: confirm => {
          if (confirm) {
            return updateQuantity(quantity, id)
          }
          setModalActive(false)
        },
      })
      setModalActive(true)
    } else {
      updateQuantity(quantity, id)
    }
  }

  const updateQuantity = (quantity, id) => {
    setCartLoading(true)
    setModalActive(false)
    cartService
      .setItemQuantity(id, quantity)
      .then(response => {
        setTotalPrice(response.data.total_price)
        setItems(response.data.items)
        setItemCount(response.data.item_count)
        setCartWidgetQuantity(response.data.item_count)
        setCartLoading(false)
      })
      .catch(err => {
        setModalActive(false)
        throw Error(err)
      })
  }

  if (!cartLoaded) {
    return
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty__content">
          <h1 className="cart-empty__heading">Your Shopping Cart is Empty</h1>
          <div className="cart-empty__cta">
            {/* TODO: URL should be dynamic. */}
            <a href="/" class="button button--primary">
              Start Shopping
            </a>
          </div>
        </div>
      </div>
    )
  }

  const className = cartLoading ? 'cart ' + cssClasses.loading : 'cart'

  return (
    <div className={className}>
      {modalActive && (
        <Modal name={modalContent.name} callback={modalContent.callback} />
      )}
      <div className="cart__header">
        <CartHeader itemCount={itemCount} totalPrice={getPriceString(price)} />
      </div>
      <div className="cart__content">
        <div className="cart__items-header">
          <CartItemsHeader />
        </div>
        <div className="cart__items">{items.map(renderItem)}</div>
      </div>
      <div className="cart__footer">
        <CartFooter
          totalPrice={getPriceString(price)}
          checkoutUrl={checkoutUrl}
        />
      </div>
    </div>
  )
}

// pass context values to Cart component and export Container not Cart itself
export const CartContainer = () => {
  return (
    <CartStore.Consumer>
      {({ modal }) => (
        <Cart
          modalContent={modal.content}
          modalActive={modal.active}
          setModalActive={modal.setActive}
          setModalContent={modal.setContent}
        />
      )}
    </CartStore.Consumer>
  )
}
