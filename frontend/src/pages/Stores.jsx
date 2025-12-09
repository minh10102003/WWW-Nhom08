const Stores = () => {
  // Helper function to create Google Maps URL from address
  const getGoogleMapsUrl = (address) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  }

  const stores = [
    {
      city: 'TP.HCM',
      locations: [
        {
          name: 'Showroom Quận 1',
          address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
          phone: '028.1234.5678',
          hours: '8:00 - 22:00',
          features: ['Bãi đỗ xe', 'Thử máy miễn phí', 'Sửa chữa tại chỗ'],
          mapsUrl: 'https://www.google.com/maps/place/123+Nguy%E1%BB%85n+Hu%E1%BB%87,+B%E1%BA%BFn+Ngh%C3%A9,+Qu%E1%BA%ADn+1,+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh/@10.7743448,106.702848,17z/data=!3m1!4b1!4m6!3m5!1s0x31752f471fae0893:0x4a0c6395cc27f990!8m2!3d10.7743448!4d106.702848!16s%2Fg%2F11b8vfc96t?entry=ttu'
        },
        {
          name: 'Showroom Quận 7',
          address: '456 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP.HCM',
          phone: '028.2345.6789',
          hours: '8:00 - 22:00',
          features: ['Bãi đỗ xe', 'Thử máy miễn phí'],
          mapsUrl: getGoogleMapsUrl('456 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP.HCM')
        },
        {
          name: 'Showroom Quận 10',
          address: '789 Lý Thái Tổ, Phường 8, Quận 10, TP.HCM',
          phone: '028.3456.7890',
          hours: '8:00 - 22:00',
          features: ['Bãi đỗ xe', 'Thử máy miễn phí', 'Sửa chữa tại chỗ', 'Trả góp 0%'],
          mapsUrl: getGoogleMapsUrl('789 Lý Thái Tổ, Phường 8, Quận 10, TP.HCM')
        }
      ]
    },
    {
      city: 'Hà Nội',
      locations: [
        {
          name: 'Showroom Hoàn Kiếm',
          address: '321 Tràng Tiền, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
          phone: '024.1234.5678',
          hours: '8:00 - 22:00',
          features: ['Bãi đỗ xe', 'Thử máy miễn phí', 'Sửa chữa tại chỗ'],
          mapsUrl: getGoogleMapsUrl('321 Tràng Tiền, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội')
        },
        {
          name: 'Showroom Cầu Giấy',
          address: '654 Trần Duy Hưng, Phường Trung Hòa, Quận Cầu Giấy, Hà Nội',
          phone: '024.2345.6789',
          hours: '8:00 - 22:00',
          features: ['Bãi đỗ xe', 'Thử máy miễn phí', 'Trả góp 0%'],
          mapsUrl: getGoogleMapsUrl('654 Trần Duy Hưng, Phường Trung Hòa, Quận Cầu Giấy, Hà Nội')
        }
      ]
    },
    {
      city: 'Đà Nẵng',
      locations: [
        {
          name: 'Showroom Hải Châu',
          address: '987 Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, Đà Nẵng',
          phone: '0236.1234.567',
          hours: '8:00 - 22:00',
          features: ['Bãi đỗ xe', 'Thử máy miễn phí', 'Sửa chữa tại chỗ'],
          mapsUrl: getGoogleMapsUrl('987 Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, Đà Nẵng')
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Hệ thống cửa hàng
          </h1>
          <p className="text-xl text-gray-600">
            Hơn 50 showroom trên toàn quốc, phục vụ bạn mọi lúc mọi nơi
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-gray-600">Showroom</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">3</div>
            <div className="text-gray-600">Thành phố lớn</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-gray-600">Hỗ trợ online</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-gray-600">Chính hãng</div>
          </div>
        </div>

        {/* Store Listings */}
        <div className="space-y-8">
          {stores.map((cityGroup, cityIndex) => (
            <section key={cityIndex} className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in" style={{ animationDelay: `${cityIndex * 0.1}s` }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-primary">📍</span>
                {cityGroup.city}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {cityGroup.locations.map((store, storeIndex) => (
                  <div key={storeIndex} className="border-2 border-gray-200 rounded-xl p-6 hover:border-primary transition-colors">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{store.name}</h3>
                    <div className="space-y-3 text-gray-700">
                      <div className="flex gap-3">
                        <span className="text-primary">📍</span>
                        <span>{store.address}</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-primary">📞</span>
                        <span>{store.phone}</span>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-primary">🕐</span>
                        <span>{store.hours} (Hàng ngày)</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          {store.features.map((feature, featureIndex) => (
                            <span key={featureIndex} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <a
                        href={store.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 w-full px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all text-center block"
                      >
                        Xem bản đồ
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Services */}
        <section className="mt-12 bg-gradient-primary text-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Dịch vụ tại showroom</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🛒</div>
              <h3 className="font-bold mb-2">Mua hàng</h3>
              <p className="text-sm opacity-90">Sản phẩm chính hãng, giá tốt nhất</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="font-bold mb-2">Sửa chữa</h3>
              <p className="text-sm opacity-90">Bảo hành, sửa chữa chuyên nghiệp</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💳</div>
              <h3 className="font-bold mb-2">Trả góp</h3>
              <p className="text-sm opacity-90">Trả góp 0% lãi suất</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-bold mb-2">Thử máy</h3>
              <p className="text-sm opacity-90">Thử máy miễn phí trước khi mua</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-8 text-center">
          <p className="text-gray-600 mb-2">
            Cần hỗ trợ tìm showroom gần nhất?
          </p>
          <p className="text-xl font-bold text-primary">
            Hotline: 1900.5301 | Email: showroom@iuhmobile.com
          </p>
        </section>
      </div>
    </div>
  )
}

export default Stores

