import React, { useState, useEffect } from 'react';
import axios from "../../src/axios"
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';

const UserOrderInformation = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    axios.get('api/getorders', { withCredentials: true })
      .then(res => {
        const safeOrders = Array.isArray(res.data.orders) ? res.data.orders : [];
        setOrders(safeOrders);
      })
      .catch(err => console.error(err));
  }, []);

  const toggleDetails = (id) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  const formatPrice = (price) => price.toLocaleString('zh-TW', { style: 'currency', currency: 'TWD' });

 const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }) + ' ' + date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md mt-10 rounded">
      <h2 className="text-xl font-semibold mb-4">訂單資訊</h2>
      {Array.isArray(orders) && orders.length === 0 && <p>尚無訂單</p>}
      {orders.map(order => (
        <div key={order.id} className="border-b py-4">
          <p><strong>訂單編號：</strong>{order.id}</p>
          <p><strong>日期：</strong>{formatDate(order.date)}</p>
           <p><strong>付款人姓名：</strong>{order.billing_name}</p>
          <p><strong>聯絡電話：</strong>{order.billing_phone}</p>
          <p><strong>運送地址：</strong>{order.shipping_address}</p>
          <p><strong>金額：</strong>{formatPrice(order.total)}</p>
          <p><strong>狀態：</strong>{order.status}</p>
          <button onClick={() => toggleDetails(order.id)} className="flex items-center text-blue-600 mt-2">
            <span className="mr-1">{expandedOrderId === order.id ? '收起明細' : '詳細明細'}</span>
            {expandedOrderId === order.id ? <FaAngleUp /> : <FaAngleDown />}
          </button>
          {expandedOrderId === order.id && (
            <div className="mt-3 ml-4 bg-gray-50 p-3 rounded">
              {order.products.map((product, i) => (
                <div key={i} className="mb-2">
                  <p><strong>產品名稱：</strong>{product.name}</p>
                  <p><strong>數量：</strong>{product.quantity}</p>
                  <p><strong>價格：</strong>{formatPrice(product.price)}</p>
                  <hr className="my-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserOrderInformation;
