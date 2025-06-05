import React from 'react'
import ManCetegory from '../assets/Images/man.png'
import WomanCetegory from '../assets/Images/woman.png'
import KidCetegory from '../assets/Images/kid.png'

const categories = [
  {
    title: '男生',
    imageUrl: ManCetegory,
  },
  {
    title: '女生',
    imageUrl: WomanCetegory,
  },
  {
    title: '孩童',
    imageUrl: KidCetegory,
  },
];
const CategorySection = () => {
  return (
    <div className='container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 '>
      {categories.map((category,index)=>(
        <div key={index} className='relative h-64 transform transition-transform duration-300 hover:scale-105 cursor-pointer'>
          <img src={category.imageUrl} alt="" className='w-full h-full object-cover rounded-lg shadow-md'/>
          <div className='absolute top-44 left-6 '>
              <p className='text-xl font-bold'>{category.title}</p>
              <p className='text-gray-600'>查看全部</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CategorySection
