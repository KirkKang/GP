import React, { useEffect, useState } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 發送 GET 請求來獲取資料
    fetch('http://localhost:5173/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>產品列表</h1>
      <ul>
        {products.map(product => (
          <li key={product.Product_id}>
            <h2>{product.Product_name}</h2>
            <p>{product.Product_intro}</p>
            <p>{product.Product_price} 元</p>
            {product.image && <img src={product.image} alt={product.Product_name} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
