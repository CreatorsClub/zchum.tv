/** @jsx h */

import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'

const TEN_OR_MORE_VALUE = '10+'
const selectOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, TEN_OR_MORE_VALUE]

export const CartQuantity = ({ value = 0, id, onChange }) => {
  const [input, forceInputField] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)
  const inputRef = useRef(null)

  const handleQuantityChange = e => {
    if (onChange && e.target.value !== currentValue) {
      setCurrentValue(e.target.value)
      if (e.target.value === TEN_OR_MORE_VALUE) {
        forceInputField(true)
      } else {
        forceInputField(false)
        onChange(e.target.value, id)
      }
    }
  }

  useEffect(() => {
    if (input) {
      inputRef.current.focus()
    }
  })

  const renderInput = () => {
    return (
      <input
        className="input input--qty"
        value={value}
        onBlur={handleQuantityChange}
        ref={inputRef}
      />
    )
  }

  const renderSelect = () => {
    return (
      <select className="select select--large" value={value} onChange={handleQuantityChange}>
        {selectOptions.map(item => (
          <option key={item} id={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    )
  }

  if (value >= 10 || input) {
    return renderInput()
  }

  return renderSelect()
}
