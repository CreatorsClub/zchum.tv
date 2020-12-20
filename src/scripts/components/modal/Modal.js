/** @jsx h */

import { h } from 'preact'

export const Modal = ({ name, callback }) => {
  const handleConfirmAction = () => {
    callback(true)
  }

  const handleCancelAction = () => {
    callback(false)
  }

  return (
    <div className="modal">
      <div className="modal__overlay" onClick={handleCancelAction} />
      <div className="modal__content modal__content--shift-up">
        <button className="modal__close" onClick={handleCancelAction}>
          {/* TODO: Improve the icon system in JS files. */}
          <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 7L1.27 1.27 7 7l5.73-5.73L7 7zm0 0l5.73 5.73L7 7l-5.73 5.73L7 7z" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="square" />
          </svg>
        </button>
        <p className="modal__heading modal__heading--center">Are you sure you want to remove {name} from your cart?</p>
        <div className="modal__cta">
          <button onClick={handleCancelAction} className="button button--primary button--outline"><span>No</span></button>
          <button onClick={handleConfirmAction} className="button button--primary button--outline"><span>Yes</span></button>
        </div>
      </div>
    </div>
  )
}
