import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import NoProduct from '../assets/Images/noproduct.png';

const FilterData = () => {
  const { keyword } = useParams();
  const allProducts = useSelector((state) => state.product.products);
  const [matchedProducts, setMatchedProducts] = useState([]);

  useEffect(() => {
    if (keyword && allProducts.length > 0) {
      const result = allProducts.filter((product) =>
        product.Bookname.toLowerCase().includes(keyword.toLowerCase())
      );
      setMatchedProducts(result);
    }
  }, [keyword, allProducts]);

  return (
    <div className='mx-auto py-12 px-4 md:px-16 lg:px-24'>
      {matchedProducts.length > 0 ? (
        <>
          <h2 className='text-2xl font-bold mb-6 text-center'>搜尋結果：{keyword}</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 cursor-pointer'>
            {matchedProducts
              .filter((product) => product.Shelf_status !== 0)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </>
      ) : (
        <div className='flex flex-col justify-center'>
          <img src={NoProduct} alt='' className='w-full h-[600px] object-contain mb-4' />
          <h2 className='mt-4 text-lg font-semibold text-center'>沒有找到「{keyword}」的商品</h2>
        </div>
      )}
    </div>
  );
};

export default FilterData;
