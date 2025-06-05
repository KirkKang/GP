import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const Order = () => {
     const navigate = useNavigate()
  const reduxOrder = useSelector(state => state.order.currentOrder);
  const [order, setOrder] = useState(null);

 
  useEffect(() => {
    if (reduxOrder) {
      setOrder(reduxOrder);
    } else {
      const storedOrder = localStorage.getItem("latestOrder");
      if (storedOrder) {
        setOrder(JSON.parse(storedOrder));
      }
    }
  }, [reduxOrder]);
    if (!order) {
    return <div>訂單資料載入中或不存在</div>;
  }
  
  
  return (
    <div className='container mx-auto py-8 px-4 md:px-16 lg:px-24'>
        <h2 className='text-2xl font-semibold mb-4'>感謝您的訂購</h2>
        <p>您已成功下定，很快會收到信件</p>
        <div className='mt-6 p-4 border rounded-lg bg-gray-100'>
            <h3 className='text-lg font-semibold mb-2'>訂單資料</h3>
            <p>訂單編號:{order.order_number}</p>
            <div className='mt-4'>
                <h4 className='text-md font-semibold mb-2'>訂單資訊</h4>
                 <p>{order.billing_name}</p>
  <p>{order.billing_email}</p>
  <p>{order.billing_phone}</p>
  <p>{order.shipping_address}</p>
  <p>{order.shipping_zip}</p>
            </div>
            <div className='mt-4'>
                <h4 className='text-md font-semibold mb-2'>產品資訊</h4>
                {order.items.map(product => (
                    <div key={product.product_id} className='flex justify-between mt-2'>
                        <p>{product.product_name} X {product.quantity}</p>
                        <p>${product.quantity * product.price}</p>
                    </div>
                ))}
            </div>
            <div className='mt-4 flex justify-between'>
                <span>總價錢:</span>
                <span className='font-semibold'>${order.total_price}</span>
            </div>
            <div className='mt-6'>
                {/* <button className='bg-green-500 text-white py-2 px-4 hover:bg-green-600'>TRACKING</button> */}
                <button className='ml-4 bg-red-600 text-white py-2 px-4 hover:bg-red-800' onClick={()=> navigate('/')}>繼續購物</button>
            </div>
        </div>
    </div>
  )
}

export default Order
