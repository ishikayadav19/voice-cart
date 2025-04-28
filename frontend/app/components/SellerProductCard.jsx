import React from 'react';

const SellerProductCard = ({ product, onEdit, onDelete, onUpdateStock }) => {
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
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => onEdit(product.id)}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => onUpdateStock(product.id)}
            className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          >
            Update Stock
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProductCard;