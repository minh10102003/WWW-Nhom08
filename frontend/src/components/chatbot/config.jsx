import React from 'react'
import { createChatBotMessage } from 'react-chatbot-kit'
import Options from './widgets/Options'
import ProductResults from './widgets/ProductResults'

const config = {
  initialMessages: [
    createChatBotMessage(
      `Xin chào! Tôi là trợ lý AI của IUH Mobile. Tôi có thể giúp bạn:
      
• Tìm kiếm sản phẩm theo yêu cầu
• Tư vấn về điện thoại, phụ kiện
• So sánh sản phẩm
• Hướng dẫn mua hàng

Bạn đang tìm kiếm sản phẩm gì?`,
      {
        widget: 'options',
      }
    ),
  ],
  botName: 'Trợ lý AI',
  customStyles: {
    botMessageBox: {
      backgroundColor: '#8B0000',
      color: '#ffffff',
    },
    chatButton: {
      backgroundColor: '#8B0000',
    },
  },
  customComponents: {
    header: () => null,
  },
  widgets: [
    {
      widgetName: 'options',
      widgetFunc: (props) => {
        return <Options {...props} />
      },
    },
    {
      widgetName: 'productResults',
      widgetFunc: (props) => {
        return <ProductResults {...props} />
      },
    },
  ],
}

export default config

