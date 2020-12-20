import axios from 'axios'

export const cartService = {
  getCart: () => axios.get('/cart.js'),

  setItemQuantity: (id, quantity) =>
    axios.post('/cart/change.js', {
      id,
      quantity,
    }),

  // [{ id, quantity, properties }]
  addToCart: items =>
    axios.post('/cart/add.js', {
      items,
    }),
}
