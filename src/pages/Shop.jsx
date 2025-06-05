import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import ProductCard from '../components/ProductCard'
import { FaLaptop, FaCouch, FaBook, FaBoxes, FaTshirt, FaPuzzlePiece, FaTv, FaRunning } from 'react-icons/fa'
import { Categories } from '../assets/mockData'

const categoryIcons = {
  "3C": <FaLaptop size={24} />,
  "家具": <FaCouch size={24} />,
  "書": <FaBook size={24} />,
  "衣物": <FaTshirt size={24} />,
  "玩具": <FaPuzzlePiece size={24} />,
  "家電": <FaTv size={24} />,
  "運動用品": <FaRunning size={24} />,
  "其他": <FaBoxes size={24} />,
}

const Shop = () => {
    const products = useSelector(state => state.product)
    const [selectedCategory, setSelectedCategory] = useState(null)

    const filteredProducts = products.products
    .filter(product => product.Shelf_status !== 0)
    .filter(product => !selectedCategory || product.Type === selectedCategory)

  return (
      <div className='mx-auto py-12 px-4 md:px-16 lg:px-24'>
        <h2 className='text-2xl font-bold mb-6 text-center'>商品</h2>


        {selectedCategory && (
        <p className="text-center text-lg font-medium mb-4">
          目前顯示：「{selectedCategory}」類別
        </p>
        )}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto'>
        {Categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
            className={`flex flex-col items-center p-4 border rounded-xl transition 
              ${selectedCategory === category ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-red-100'}`}
          >
            {categoryIcons[category]}
            <span className='mt-1 text-sm'>{category}</span>
          </button>
        ))}
      </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 cursor-pointer'>
          {filteredProducts.map((product)=>(
              <ProductCard key={product.id} product={product}/>
          ))} 
        </div>
      </div>
  )
}

export default Shop
