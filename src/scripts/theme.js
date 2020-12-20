const isLoadingClass = 'is-loading'

import input from './components/input'
import select from './components/select'
import video from './components/video'
import drawer from './components/drawer'
import { Product } from './components/product/'
import modal from './components/modal'
import pageSelect from './components/page-select'
import { cart } from './components/cart'
import accordion from './components/accordion'
import { newsletter } from './components/forms/newsletter'
import timer from './components/timer'
import cartWidget from './components/cartWidget'

input()
select()
video()
drawer()
modal()
pageSelect()
cart()
newsletter()
accordion()
timer()
newsletter()
cartWidget()

const product = new Product()
