import React, { useEffect } from 'react'
import { Categories, mockData } from '../assets/mockData'
import HeroImage from '../assets/Images/hero-page.png'
import InfoSection from '../components/InfoSection'
import CategorySection from '../components/CategorySection'
import { setProducts } from '../redux/productSlice'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../components/ProductCard'
import Shop from './Shop'
import { Link } from 'react-router-dom'
import axios from "../../src/axios"
// import ProductList from '../ProductList'

const Home = () => {
  const dispatch = useDispatch()
  const products = useSelector(state => state.product)
  // useEffect(()=> {
  //   dispatch(setProducts(mockData))
  // },[])
  useEffect(()=>{
    const fetchProducts = async () => {
      try {
          const res = await axios.get("api/products")
          dispatch(setProducts(res.data))
          console.log(res.data)
      }
      catch(error){
        console.log("fail",error)
      }
    };
    fetchProducts()
  },[dispatch])

  const topProducts = [...products.products]
  .filter(p => p.Shelf_status !== 0) // 篩掉已下架商品
  .sort((a, b) => b.Sell_quantity - a.Sell_quantity)
  .slice(0, 5)
  return (
  <div>
    <div className='bg-white mt-2 px-4 md:px-16 lg:px-24'>
      <div className='container mx-auto py-4 flex flex-col md:flex-row space-x-2'>
        {/* <div className='w-full md:w-3/12'>
            <div className='bg-red-600 text-white text-xs font-bold px-2 py-2.5'>商店的類別</div>
            <ul className='space-y-4 bg-gray-100 p-3 border'>  
              {Categories.map((category, index)=>(
                <li key={index} className='flex items-center text-sm font-medium'>
                  <div className='w-2 h-2 border border-red-500 rounded-full mr-2'></div>
                  {category}
                </li>
              ))}
            </ul>
        </div> */}
        
        <div className='w-full md:9/12 mt-8 md:mt-0 h-96 relative'>
            <img src={HeroImage} alt="" className="h-full w-full"></img>
            <div className='absolute top-16 left-8'>
              <p className='text-gray-600 mb-4'>二手購物網站</p>
              <h2 className='text-3xl font-bold'>歡迎來到二網</h2>
              <p className='text-xl mt-2.5 font-bold text-gray-800'>多種商品</p>
              <Link to ='/shop' className="inline-flex bg-red-600 px-8 py-1.5 text-white mt-4 hover:bg-red-700 
             transform transition-transform duration-300 hover:scale-105 
             items-center justify-center">前往購物</Link>
            </div>
        </div>
      </div>
      <InfoSection />
      {/* <CategorySection /> */}
      {/* <ProductList /> */}

      
      <div className='container mx-auto py-12'>
        <h2 className='text-2xl font-bold mb-6 text-center'>熱門商品</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 cursor-pointer'>
          {topProducts.map(((product)=>(
            <ProductCard key={product.id} product={product}/>
          )))}
            
          
        </div>
      </div>
    </div>
    {/* <Shop /> */}
  </div>
  )
}

export default Home
