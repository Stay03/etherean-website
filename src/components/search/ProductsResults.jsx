import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import useProducts from '../../hooks/useProducts';
import SearchResultCard from './SearchResultCard';
import { Link } from 'react-router-dom';
import { type } from '@testing-library/user-event/dist/type';

const SectionLoader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ProductsResults = ({ searchQuery }) => {
  const filters = useMemo(() => ({
    search: searchQuery,
    visibility: '1',
    platform: 'EL', // Adjust as needed
    type: 'physical', // Assuming you want to filter by physical products
    per_page: 3,
    page: 1,
    // No type or price range filters for general search
  }), [searchQuery]);

  const { products, isLoading, error, pagination } = useProducts(filters);

  if (isLoading) return <SectionLoader />;
  if (error) return <p className="text-red-500">Error loading products: {error.message}</p>;
  if (!products || products.length === 0) {
    return <p className="text-gray-600">No products found matching "{searchQuery}".</p>;
  }

  return (
    <div className="space-y-4">
      {products.map(product => (
        <SearchResultCard key={`product-${product.id}`} item={product} type="product" />
      ))}
       {pagination && pagination.total > products.length && (
         <Link 
            to={`/shop?search=${encodeURIComponent(searchQuery)}`}
            className="inline-block mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
        >
            View all {pagination.total} products
        </Link>
      )}
    </div>
  );
};

ProductsResults.propTypes = {
  searchQuery: PropTypes.string.isRequired,
};

export default ProductsResults;