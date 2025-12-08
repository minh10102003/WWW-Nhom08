import { createChatBotMessage } from 'react-chatbot-kit'
import { productApi } from '../../services/api'

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage
    this.setState = setStateFunc
  }

  handleFindProduct = async (query) => {
    try {
      // Show loading message
      const loadingMessage = this.createChatBotMessage('Đang tìm kiếm sản phẩm...')
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, loadingMessage],
      }))

      // Search products
      const response = await productApi.search(query, 1)
      const products = response.data?.content || []

      if (products.length > 0) {
        const message = this.createChatBotMessage(
          `Tìm thấy ${products.length} sản phẩm phù hợp với "${query}":`,
          {
            widget: 'productResults',
          }
        )

        this.setState((prev) => {
          const updatedMessages = [...prev.messages, message]
          const messageIndex = updatedMessages.length - 1
          
          // Lưu products vào state với index của message
          const updatedProductsMap = {
            ...(prev.productsMap || {}),
            [messageIndex]: products
          }
          
          return {
            ...prev,
            messages: updatedMessages,
            productsMap: updatedProductsMap,
          }
        })
      } else {
        const message = this.createChatBotMessage(
          `Xin lỗi, tôi không tìm thấy sản phẩm nào phù hợp với "${query}". Bạn có thể thử tìm kiếm với từ khóa khác hoặc xem tất cả sản phẩm tại cửa hàng.`
        )
        this.setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }))
      }
    } catch (error) {
      console.error('Error searching products:', error)
      const message = this.createChatBotMessage(
        'Xin lỗi, có lỗi xảy ra khi tìm kiếm sản phẩm. Vui lòng thử lại sau.'
      )
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }))
    }
  }

  // Hàm hỏi lại người dùng về dòng iPhone muốn tìm
  handleAskForiPhoneModel = () => {
    const message = this.createChatBotMessage(
      'Bạn muốn tìm dòng iPhone nào?'
    )
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }))
  }

  handleLatestProducts = async () => {
    try {
      const response = await productApi.getLatest()
      const products = response.data || []

      if (products.length > 0) {
        const message = this.createChatBotMessage(
          `Đây là ${products.length} sản phẩm mới nhất:`,
          {
            widget: 'productResults',
          }
        )

        this.setState((prev) => {
          const updatedMessages = [...prev.messages, message]
          const messageIndex = updatedMessages.length - 1
          
          // Lưu products vào state với index của message
          const updatedProductsMap = {
            ...(prev.productsMap || {}),
            [messageIndex]: products
          }
          
          return {
            ...prev,
            messages: updatedMessages,
            productsMap: updatedProductsMap,
          }
        })
      } else {
        const message = this.createChatBotMessage('Hiện tại chưa có sản phẩm mới.')
        this.setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }))
      }
    } catch (error) {
      console.error('Error fetching latest products:', error)
      const message = this.createChatBotMessage(
        'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.'
      )
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }))
    }
  }

  handleGreeting = () => {
    const message = this.createChatBotMessage(
      'Xin chào! Tôi có thể giúp bạn tìm kiếm sản phẩm. Bạn đang tìm kiếm gì?'
    )
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }))
  }

  handleThanks = () => {
    const message = this.createChatBotMessage(
      'Không có gì! Nếu bạn cần thêm thông tin gì, cứ hỏi tôi nhé! 😊'
    )
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }))
  }

  // Hàm lọc sản phẩm để chỉ giữ lại phiên bản cơ bản (loại bỏ Pro/Max/Plus)
  filterBasicVersions(products) {
    return products.filter(product => {
      const productName = (product.tenSanPham || '').toLowerCase()
      // Loại bỏ các sản phẩm có chứa: pro, max, plus, mini (không phân biệt hoa thường)
      const excludeKeywords = ['pro', 'max', 'plus', 'mini']
      return !excludeKeywords.some(keyword => productName.includes(keyword))
    })
  }

  // Xử lý câu hỏi về giá của sản phẩm
  handleProductPrice = async (query, productName, isBasicVersion = false) => {
    try {
      const loadingMessage = this.createChatBotMessage('Đang tìm kiếm thông tin giá...')
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, loadingMessage],
      }))

      // Tìm kiếm sản phẩm theo tên
      const response = await productApi.search(productName, 1)
      let products = response.data?.content || []

      // Nếu yêu cầu phiên bản cơ bản, lọc bỏ Pro/Max/Plus
      if (isBasicVersion) {
        products = this.filterBasicVersions(products)
      }

      if (products.length > 0) {
        // Lấy danh sách giá duy nhất và sắp xếp
        const prices = products
          .map(p => p.donGia)
          .filter((price, index, self) => self.indexOf(price) === index)
          .sort((a, b) => a - b)

        const priceList = prices
          .map(price => new Intl.NumberFormat('vi-VN').format(price) + ' đ')
          .join(', ')

        const message = this.createChatBotMessage(
          `Tìm thấy ${products.length} sản phẩm ${productName.toUpperCase()} với các mức giá:\n\n${priceList}\n\nDưới đây là danh sách sản phẩm:`,
          {
            widget: 'productResults',
          }
        )

        this.setState((prev) => {
          const updatedMessages = [...prev.messages, message]
          const messageIndex = updatedMessages.length - 1
          
          // Lưu products vào state với index của message
          const updatedProductsMap = {
            ...(prev.productsMap || {}),
            [messageIndex]: products
          }
          
          return {
            ...prev,
            messages: updatedMessages,
            productsMap: updatedProductsMap,
          }
        })
      } else {
        const message = this.createChatBotMessage(
          `Xin lỗi, tôi không tìm thấy sản phẩm "${productName}" trong cửa hàng. Bạn có thể thử tìm kiếm với tên khác.`
        )
        this.setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }))
      }
    } catch (error) {
      console.error('Error searching product price:', error)
      const message = this.createChatBotMessage(
        'Xin lỗi, có lỗi xảy ra khi tìm kiếm thông tin giá. Vui lòng thử lại sau.'
      )
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }))
    }
  }

  // Xử lý câu hỏi về màu sắc của sản phẩm
  handleProductColor = async (query, productName, isBasicVersion = false) => {
    try {
      const loadingMessage = this.createChatBotMessage('Đang tìm kiếm thông tin màu sắc...')
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, loadingMessage],
      }))

      // Tìm kiếm sản phẩm theo tên
      const response = await productApi.search(productName, 1)
      let products = response.data?.content || []

      // Nếu yêu cầu phiên bản cơ bản, lọc bỏ Pro/Max/Plus
      if (isBasicVersion) {
        products = this.filterBasicVersions(products)
      }

      if (products.length > 0) {
        // Lấy danh sách màu sắc duy nhất
        const colors = products
          .map(p => p.mauSac)
          .filter((color, index, self) => 
            color && 
            color.trim() !== '' && 
            self.indexOf(color) === index
          )

        if (colors.length > 0) {
          const colorList = colors.join(', ')

          const message = this.createChatBotMessage(
            `Sản phẩm ${productName.toUpperCase()} có các màu sắc sau:\n\n${colorList}\n\nDưới đây là danh sách sản phẩm:`,
            {
              widget: 'productResults',
            }
          )

          this.setState((prev) => {
            const updatedMessages = [...prev.messages, message]
            const messageIndex = updatedMessages.length - 1
            
            // Lưu products vào state với index của message
            const updatedProductsMap = {
              ...(prev.productsMap || {}),
              [messageIndex]: products
            }
            
            return {
              ...prev,
              messages: updatedMessages,
              productsMap: updatedProductsMap,
            }
          })
        } else {
          const message = this.createChatBotMessage(
            `Xin lỗi, tôi không tìm thấy thông tin màu sắc cho sản phẩm "${productName}". Dưới đây là danh sách sản phẩm:`,
            {
              widget: 'productResults',
            }
          )

          this.setState((prev) => {
            const updatedMessages = [...prev.messages, message]
            const messageIndex = updatedMessages.length - 1
            
            // Lưu products vào state với index của message
            const updatedProductsMap = {
              ...(prev.productsMap || {}),
              [messageIndex]: products
            }
            
            return {
              ...prev,
              messages: updatedMessages,
              productsMap: updatedProductsMap,
            }
          })
        }
      } else {
        const message = this.createChatBotMessage(
          `Xin lỗi, tôi không tìm thấy sản phẩm "${productName}" trong cửa hàng. Bạn có thể thử tìm kiếm với tên khác.`
        )
        this.setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }))
      }
    } catch (error) {
      console.error('Error searching product color:', error)
      const message = this.createChatBotMessage(
        'Xin lỗi, có lỗi xảy ra khi tìm kiếm thông tin màu sắc. Vui lòng thử lại sau.'
      )
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }))
    }
  }

  // Xử lý câu hỏi nghi vấn về sự tồn tại của sản phẩm
  handleProductExistence = async (query, productName, isBasicVersion = false) => {
    try {
      const loadingMessage = this.createChatBotMessage('Đang kiểm tra...')
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, loadingMessage],
      }))

      // Tìm kiếm sản phẩm theo tên
      const response = await productApi.search(productName, 1)
      let products = response.data?.content || []

      // Nếu yêu cầu phiên bản cơ bản, lọc bỏ Pro/Max/Plus
      if (isBasicVersion) {
        products = this.filterBasicVersions(products)
      }

      if (products.length > 0) {
        // Có sản phẩm - hiển thị danh sách
        const versionNote = isBasicVersion ? ' (phiên bản thường)' : ''
        const message = this.createChatBotMessage(
          `Có! Chúng tôi có ${products.length} sản phẩm ${productName.toUpperCase()}${versionNote} trong cửa hàng:\n\nDưới đây là danh sách sản phẩm:`,
          {
            widget: 'productResults',
          }
        )

        this.setState((prev) => {
          const updatedMessages = [...prev.messages, message]
          const messageIndex = updatedMessages.length - 1
          
          // Lưu products vào state với index của message
          const updatedProductsMap = {
            ...(prev.productsMap || {}),
            [messageIndex]: products
          }
          
          return {
            ...prev,
            messages: updatedMessages,
            productsMap: updatedProductsMap,
          }
        })
      } else {
        // Không có sản phẩm
        const versionNote = isBasicVersion ? ' (phiên bản thường)' : ''
        const message = this.createChatBotMessage(
          `Xin lỗi, hiện tại chúng tôi không có sản phẩm ${productName.toUpperCase()}${versionNote} trong cửa hàng. Bạn có thể xem các sản phẩm khác hoặc liên hệ với chúng tôi để được tư vấn thêm.`
        )
        this.setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }))
      }
    } catch (error) {
      console.error('Error checking product existence:', error)
      const message = this.createChatBotMessage(
        'Xin lỗi, có lỗi xảy ra khi kiểm tra sản phẩm. Vui lòng thử lại sau.'
      )
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }))
    }
  }
}

export default ActionProvider

