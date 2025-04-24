import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="aspect-w-1 aspect-h-1">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h2>
        <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-rose-600">${product.price}</span>
            {product.discountPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.discountPrice}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 