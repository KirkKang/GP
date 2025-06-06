import React from 'react'
import {FaShippingFast,FaHeadset, FaMoneyBillWave, FaLock, FaTag,} from 'react-icons/fa'

const InfoSection = () => {
  const infoItems =[
    {
      icon: <FaShippingFast className='text-3xl text-red-600'/>,
      title: '免運費',
      description: '不管價錢、距離，國內通通免運'
    },
    {
      icon: <FaHeadset className='text-3xl text-red-600'/>,
      title: '24小時在線',
      description: '隨時都有專人在線服務'
    },
    {
      icon: <FaMoneyBillWave className='text-3xl text-red-600'/>,
      title: '全額退費',
      description: '七天鑑賞期，無條件退費'
    },
    {
      icon: <FaLock className='text-3xl text-red-600'/>,
      title: '保密性高',
      description: '不用擔心個人資料外洩'
    },
    {
      icon: <FaTag className='text-3xl text-red-600'/>,
      title: '折扣',
      description: '享受全國最實惠的價格'
    },

  ];
  return (
    <div className='bg-white pb-8 pt-12'>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
        {infoItems.map((item,index)=>(
          <div key={index} className='flex flex-col items-center text-center p-4 border rounded-lg shadow-md
          transform transition-transform duration-300 '>
            {/* hover:scale-105 cursor-pointer */}
            {item.icon}
            <h3 className='mt-4 text-xl font-semibold'>{item.title}</h3>
            <p className='mt-2 text-gray-600'>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InfoSection
