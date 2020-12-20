import { cartService } from '../utils/cartService'
import { setCartWidgetQuantity } from '../utils'

export default function () {
  cartService
    .getCart()
    .then((response) => {
      if (
        response.data !== undefined &&
        response.data.item_count !== undefined
      ) {
        setCartWidgetQuantity(response.data.item_count)
      }
    })
    .catch((error) => {
      console.error(error)
    })
}
