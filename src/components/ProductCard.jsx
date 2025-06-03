import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

console.log("product.price:", product.price)

  return (
    <div className="card group transition-transform duration-300 hover:scale-105 rounded-2xl">
      <Link to={`/products/${product.id}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110 rounded-2xl"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-[#7042D2]">{product.name}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-900 font-bricolage text-xl font-bold">${Number (product?.price)?.toFixed(2)}</span>
            {/* <span className="text-sm text-gray-500">{product.unit}</span> */}
          </div>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <button 
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="w-full bg-[#7042D2] mt-3 text-white font-bricolage py-2 rounded-xl"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;