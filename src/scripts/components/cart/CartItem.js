/** @jsx h */

import { h } from 'preact'

import { CartQuantity } from './CartQuantity'

export const CartItem = ({
  id,
  image,
  productTitle,
  variantTitle,
  url,
  handle,
  quantity,
  price,
  onQuantityChange,
}) => {
  const handleRemoveItem = () => {
    onQuantityChange(0, id, productTitle)
  }

  return (
    <div className="cart-item">
      <div className="cart-item__section cart-item__section--main">
        <div className="cart-item__main">
          <div className="cart-item__image">
            <div className="cart-item__image-inner">
              <a
                href={url || `/products/${handle}`}
                className="cart-item__image-link"
              >
                <div className="image">
                  <div className="image__object">
                    <img src={image} alt={productTitle} />
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="cart-item__description">
            <a href={url || `/products/${handle}`} className="cart-item__title">
              <span>{productTitle}</span>
            </a>
            {variantTitle && <p>{variantTitle}</p>}
          </div>
        </div>
      </div>

      <div className="cart-item__section cart-item__section--quantity">
        <div class="cart-item__quantity">
          <CartQuantity id={id} value={quantity} onChange={onQuantityChange} />
        </div>
      </div>

      <div className="cart-item__section cart-item__section--price">
        <span class="cart-item__price" data-cart-item="price">
          {price}
        </span>
      </div>

      <div className="cart-item__section cart-item__section--remove">
        <button class="cart-item__remove" onClick={handleRemoveItem}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 7L1.27 1.27 7 7l5.73-5.73L7 7zm0 0l5.73 5.73L7 7l-5.73 5.73L7 7z"
              stroke-width="1.5"
              fill="none"
              fill-rule="evenodd"
              stroke-linecap="square"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
