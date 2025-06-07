import React from 'react'
import { useSelector } from 'react-redux'
import ProductCard from '../components/ProductCard'
import NoProduct from '../assets/Images/noproduct.png'
const FilterData = () => {
    const filterProducts = useSelector(state => state.product.filteredData)
  return (
    <div className='mx-auto py-12 px-4 md:px-16 lg:px-24'>
        {filterProducts.length > 0 ? <>
        <h2 className='text-2xl font-bold mb-6 text-center'>商品</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 cursor-pointer'>
          {filterProducts.filter(product => product.Shelf_status !== 0)
          .map(((product)=>(
            <ProductCard key={product.id} product={product}/>
          )))}  
        </div>
        </>
        :
        <div className='flex flex-col justify-center'>
            <img src={NoProduct} alt='' className='w-full h-[600px] object-contain mb-4'/>
            <h2 className='mt-4 text-lg font-semibold text-center'>沒有找到商品</h2>
        </div>
        }
    </div>
  )
}

export default FilterData
