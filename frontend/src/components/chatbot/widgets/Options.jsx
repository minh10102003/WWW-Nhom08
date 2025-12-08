import React from 'react'

const Options = (props) => {
  const options = [
    {
      text: 'Tìm điện thoại',
      handler: () => props.actionProvider.handleAskForiPhoneModel(),
      id: 1,
    },
    {
      text: 'Sản phẩm mới nhất',
      handler: () => props.actionProvider.handleLatestProducts(),
      id: 2,
    },
  ]

  return (
    <div className="options-container">
      {options.map((option) => (
        <button
          key={option.id}
          className="option-button"
          onClick={option.handler}
        >
          {option.text}
        </button>
      ))}
    </div>
  )
}

export default Options

