import Link from "next/link"

const OfferBanner = () => {
  return (
    <section className="container mx-auto px-4 mb-12">
      <div className="bg-gradient-to-r from-purple-600 to-rose-600 rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Summer Sale is Live!</h2>
            <p className="text-white text-lg mb-6">Get up to 50% off on selected items. Limited time offer.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/sale">
                <span className="px-6 py-3 bg-white text-rose-600 font-semibold rounded-full hover:bg-gray-100 transition-colors">
                  Shop Now
                </span>
              </Link>
              <Link href="/category/fashion">
                <span className="px-6 py-3 border border-white text-white font-semibold rounded-full hover:bg-white hover:bg-opacity-10 transition-colors">
                  Learn More
                </span>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img src="/placeholder.svg?height=300&width=600" alt="Summer Sale" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default OfferBanner
