class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase().trim()

    // BƯỚC 1: Kiểm tra các câu hỏi đặc biệt TRƯỚC (giá, màu sắc, câu hỏi nghi vấn)
    // Nhận diện câu hỏi về giá
    const priceKeywords = ['giá', 'bao nhiêu', 'cost', 'price', 'giá cả', 'giá tiền', 'giá trị']
    const isPriceQuestion = priceKeywords.some(keyword => lowerCaseMessage.includes(keyword))

    // Nhận diện câu hỏi về màu sắc
    const colorKeywords = ['màu', 'màu sắc', 'color', 'có màu', 'màu gì', 'màu nào', 'màu sắc gì']
    const isColorQuestion = colorKeywords.some(keyword => lowerCaseMessage.includes(keyword))

    // Nhận diện câu hỏi nghi vấn về sự tồn tại của sản phẩm
    // Ví dụ: "có iphone 13 không?", "có bán iphone 13 không?", "có iphone 13 chưa?"
    // Kiểm tra nếu câu hỏi bắt đầu bằng "có" và kết thúc bằng "không" hoặc "chưa"
    const hasExistenceKeywords = lowerCaseMessage.includes('có') && 
      (lowerCaseMessage.includes('không') || lowerCaseMessage.includes('chưa'))
    
    // Kiểm tra pattern cụ thể hơn
    const existenceQuestionPatterns = [
      /^có\s+.*\s+không/i,
      /^có\s+bán\s+.*\s+không/i,
      /^có\s+.*\s+chưa/i,
      /^có\s+.*\s+không\s+ạ/i,
      /^có\s+.*\s+chưa\s+ạ/i,
      /có\s+.*\s+không\s*\?/i,
      /có\s+bán\s+.*\s+không\s*\?/i,
      /có\s+.*\s+chưa\s*\?/i,
    ]
    const isExistenceQuestion = hasExistenceKeywords && 
      (existenceQuestionPatterns.some(pattern => pattern.test(message)) || 
       (lowerCaseMessage.startsWith('có') && (lowerCaseMessage.includes('không') || lowerCaseMessage.includes('chưa'))))

    // Nhận diện từ "thường" - yêu cầu chỉ hiển thị phiên bản cơ bản (không có Pro/Max/Plus)
    const isBasicVersionRequest = lowerCaseMessage.includes('thường') || 
                                  lowerCaseMessage.includes('cơ bản') ||
                                  lowerCaseMessage.includes('bản thường')

    // Trích xuất tên sản phẩm từ câu hỏi (ưu tiên pattern đầy đủ như "iphone 13")
    const extractedProduct = this.extractProductName(message)

    // Xử lý câu hỏi nghi vấn về sự tồn tại (ưu tiên cao nhất)
    if (isExistenceQuestion && extractedProduct) {
      console.log('❓ Detected existence question for:', extractedProduct, 'isBasicVersion:', isBasicVersionRequest)
      this.actionProvider.handleProductExistence(message, extractedProduct, isBasicVersionRequest)
      return
    }

    // Xử lý câu hỏi về giá
    if (isPriceQuestion) {
      if (extractedProduct) {
        console.log('🔍 Detected price question for:', extractedProduct, 'isBasicVersion:', isBasicVersionRequest)
        this.actionProvider.handleProductPrice(message, extractedProduct, isBasicVersionRequest)
        return
      }
    }

    // Xử lý câu hỏi về màu sắc
    if (isColorQuestion) {
      if (extractedProduct) {
        console.log('🎨 Detected color question for:', extractedProduct, 'isBasicVersion:', isBasicVersionRequest)
        this.actionProvider.handleProductColor(message, extractedProduct, isBasicVersionRequest)
        return
      }
    }

    // BƯỚC 2: Kiểm tra các intent khác
    if (
      lowerCaseMessage.includes('mới nhất') ||
      lowerCaseMessage.includes('sản phẩm mới') ||
      lowerCaseMessage.includes('latest') ||
      (lowerCaseMessage.includes('mới') && lowerCaseMessage.includes('sản phẩm'))
    ) {
      this.actionProvider.handleLatestProducts()
      return
    }

    if (
      lowerCaseMessage.includes('xin chào') ||
      lowerCaseMessage.includes('hello') ||
      lowerCaseMessage.includes('hi') ||
      lowerCaseMessage === 'chào'
    ) {
      this.actionProvider.handleGreeting()
      return
    }

    if (
      lowerCaseMessage.includes('cảm ơn') ||
      lowerCaseMessage.includes('thanks') ||
      lowerCaseMessage.includes('thank you')
    ) {
      this.actionProvider.handleThanks()
      return
    }

    // BƯỚC 3: Tìm kiếm sản phẩm thông thường (chỉ khi không phải câu hỏi đặc biệt)
    if (
      lowerCaseMessage.includes('tìm') ||
      lowerCaseMessage.includes('bán') ||
      lowerCaseMessage.includes('mua') ||
      lowerCaseMessage.includes('phụ kiện') ||
      lowerCaseMessage.includes('tai nghe') ||
      lowerCaseMessage.includes('sạc') ||
      lowerCaseMessage.includes('ốp lưng') ||
      lowerCaseMessage.includes('điện thoại')
    ) {
      this.actionProvider.handleFindProduct(message)
      return
    }

    // BƯỚC 4: Nếu có tên sản phẩm nhưng không phải câu hỏi đặc biệt -> tìm kiếm
    if (extractedProduct) {
      this.actionProvider.handleFindProduct(message)
      return
    }

    // BƯỚC 5: Mặc định - tìm kiếm sản phẩm
    this.actionProvider.handleFindProduct(message)
  }

  // Hàm trích xuất tên sản phẩm từ câu hỏi
  extractProductName(message) {
    const lowerCaseMessage = message.toLowerCase().trim()
    
    // Loại bỏ các từ không cần thiết như "thường", "cơ bản" trước khi extract
    const cleanedMessage = lowerCaseMessage
      .replace(/\s+thường\s+/g, ' ')
      .replace(/\s+cơ\s+bản\s+/g, ' ')
      .replace(/\s+bản\s+thường\s+/g, ' ')
      .trim()
    
    // Tìm các pattern như "iphone 13", "samsung s21", "iphone 13 pro", etc.
    // Ưu tiên pattern đầy đủ trước
    const patterns = [
      /(iphone\s+\d+)/i, // Ưu tiên pattern đơn giản trước (iphone 13, iphone 15)
      /(iphone\s+\d+\s+(pro|max|plus|mini))/i, // Sau đó mới đến các phiên bản đặc biệt
      /(samsung\s+[a-z0-9\s]+)/i,
      /(xiaomi\s+[a-z0-9\s]+)/i,
      /(oppo\s+[a-z0-9\s]+)/i,
      /(vivo\s+[a-z0-9\s]+)/i,
      /(realme\s+[a-z0-9\s]+)/i,
      /(oneplus\s+[a-z0-9\s]+)/i,
      /(huawei\s+[a-z0-9\s]+)/i,
    ]

    // Tìm trong message gốc trước
    for (const pattern of patterns) {
      const match = message.match(pattern)
      if (match) {
        let productName = match[1].toLowerCase().trim()
        // Loại bỏ "thường", "cơ bản" nếu có trong tên sản phẩm
        productName = productName
          .replace(/\s+thường\s*/g, '')
          .replace(/\s+cơ\s+bản\s*/g, '')
          .replace(/\s+bản\s+thường\s*/g, '')
          .trim()
        console.log('✅ Extracted product name:', productName)
        return productName
      }
    }

    // Nếu không tìm thấy pattern, thử tìm từ khóa đơn giản
    const simpleKeywords = ['iphone', 'samsung', 'xiaomi', 'oppo', 'vivo', 'realme', 'oneplus', 'huawei']
    for (const keyword of simpleKeywords) {
      if (lowerCaseMessage.includes(keyword)) {
        console.log('✅ Found simple keyword:', keyword)
        return keyword
      }
    }

    console.log('❌ No product name found')
    return null
  }
}

export default MessageParser

