// "use client";

// import React from 'react';
// import { Pencil, Trash2 } from "lucide-react";
// import Link from "next/link";
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// const SellerCard = ({ product }) => {
//   const router = useRouter();

//   const handleDelete = async () => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/product/delete/${product._id}`);
//         alert("Product deleted successfully!");
//         router.refresh(); // Refresh the page to reflect the changes
//       } catch (error) {
//         console.error("Error deleting product:", error);
//         alert("Failed to delete product.");
//       }
//     }
//   };

//   const handleEdit = () => {
//     router.push(`/seller/products/edit/${product._id}`);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
//       <div className="relative aspect-w-1 aspect-h-1">
//         <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
//         {product.discountPrice && (
//           <div className="absolute top-2 right-2 bg-rose-600 text-white px-2 py-1 rounded-md text-xs font-bold">
//             {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
//           </div>
//         )}
//       </div>

//       <div className="p-4">
//         <h3 className="text-lg font-semibold mb-1 text-gray-800 line-clamp-2">
//           {product.name}
//         </h3>

//         <div className="flex items-center mb-3">
//           {product.discountPrice ? (
//             <>
//               <span className="text-lg font-bold text-rose-600">${product.discountPrice.toFixed(2)}</span>
//               <span className="ml-2 text-sm line-through text-gray-500">${product.price.toFixed(2)}</span>
//             </>
//           ) : (
//             <span className="text-lg font-bold text-gray-800">${product.price.toFixed(2)}</span>
//           )}
//         </div>

//         <div className="flex space-x-2">
//           <button
//             onClick={handleEdit}
//             className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors text-sm"
//           >
//             <Pencil size={16} className="mr-2" />
//             Edit
//           </button>
//           <button
//             onClick={handleDelete}
//             className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white py-2 rounded-md font-medium transition-colors text-sm"
//           >
//             <Trash2 size={16} className="mr-2" />
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SellerCard;
"use client";

import React, { useState } from 'react';
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const SellerCard = ({product}) => {
  const router = useRouter();

  const handleDelete = async (id) => {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/product/delete/${product._id}`);
    console.log(res.data);
    // fetchProducts();
    toast.success('Product Deleted Successfully!');
};

  const handleEdit = () => {
    router.push(`/seller/products/edit/${product._id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/product/${product._id}`}>
      
      <div className="relative aspect-w-1 aspect-h-1">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
        {product.discountPrice && (
          <div className="absolute top-2 right-2 bg-rose-600 text-white px-2 py-1 rounded-md text-xs font-bold">
            {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
          </div>
        )}
      </div>
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 text-gray-800 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center mb-3">
          {product.discountPrice ? (
            <>
              <span className="text-lg font-bold text-rose-600">${product.discountPrice.toFixed(2)}</span>
              <span className="ml-2 text-sm line-through text-gray-500">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-800">${product.price.toFixed(2)}</span>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="flex items-center p-4 justify-center bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors text-sm"
          >
            <Pencil size={16} className="mr-2" />
           
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center p-4 bg-red-500 hover:bg-red-700 text-white py-2 rounded-md font-medium transition-colors text-sm"
          >
            <Trash2 size={16} className="mr-2" />
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerCard;