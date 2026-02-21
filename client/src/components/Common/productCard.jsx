import { Link } from 'react-router-dom';

const PRIMARY_COLOR = '#ea2e0e';
export const ProductCard = ({ product }) => {
    const imageUrl = product.imageUrls && product.imageUrls.length > 0
        ? product.imageUrls[0]
        : `https://placehold.co/600x400/9ca3af/ffffff?text=Image+Missing`;

    console.log(`Product ${product.name} imageUrl:`, imageUrl); // Debug: Check image URL

    return (
        <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
            {/* Image Container with Overlay */}
            <div className="w-full aspect-square overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={`Image of ${product.name}`}
                    className="w-full h-full object-cover"
                    onLoad={() => console.log(`Image loaded: ${product.name}`)}
                    onError={(e) => {
                        console.error(`Image failed to load for ${product.name}:`, imageUrl);
                        e.target.src = `https://placehold.co/600x400/9ca3af/ffffff?text=Image+Missing`;
                    }}
                />
                {/* New Arrival Badge */}
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                    New
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <Link
                        to={`/product/${product._id}`}
                        className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-lg hover:shadow-xl"
                        aria-label={`View details for ${product.name}`}
                    >
                        View Details
                    </Link>
                </div>
            </div>
            <div className="p-5 flex flex-col justify-between min-h-[144px]">
                <div>
                    {/* Category Badge */}
                    {product.category && (
                        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full mb-2">
                            {product.category}
                        </span>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 truncate mb-1" title={product.name}>
                        {product.name}
                    </h3>
                    {/* Short Description */}
                    {product.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2" title={product.description}>
                            {product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description}
                        </p>
                    )}
                </div>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>
                        Ksh {product.price ? product.price.toFixed(2) : 'N/A'}
                    </p>
                    {/* Rating */}
                    <div className="flex items-center">
                        <span className="text-yellow-400 text-sm" aria-label="Rating: 4.5 out of 5 stars">★★★★☆</span>
                        <span className="text-gray-500 text-xs ml-1">(4.5)</span>
                    </div>
                </div>
            </div>
        </article>
    );
};