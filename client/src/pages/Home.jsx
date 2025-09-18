import React from 'react'
import Hero from '../components/Layout/Hero';
import GenderCollectionSection from '../components/Products/GenderCollectionSection';
import NewArrivals from '../components/Products/NewArrivals';
import ProductDetail from '../components/Products/ProductDetail';

 const Home = () => {
  return (
    <div>
        <Hero />
        <GenderCollectionSection />
        <NewArrivals />
        {/* Best seller */}
        <h2 className="text-3xl text-center font-bold mb-4">
          Best Seller
          <ProductDetail />
        </h2>
    </div>
  )
}
export default Home;
