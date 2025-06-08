import React from 'react'
import { addToCart } from '../redux/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from "../../src/axios"

const ProductCard = ({ product }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.products)

  if (product.Shelf_status === "0") {
    return null
  }

  const displayProduct = {
    ...product,
    Shelf_status: (product.quantity === 0 && product.Shelf_status !== 0) ? 2 : product.Shelf_status
  }

  const discountedPrice = Math.round(product.price * (1 - product.Discount / 100) )

  const handleAddToCart = (e, product) => {
    e.stopPropagation()
    e.preventDefault()

    const cartItem = cartItems.find(item => item.id === product.id)
    const cartQuantity = cartItem ? cartItem.quantity : 0

    if (cartQuantity >= product.quantity) {
      alert("加入失敗：已超過庫存數量！")
      return
    }

    const productForCartRedux = {
  ...product,
  price: discountedPrice,
}

    dispatch(addToCart(productForCartRedux))
    alert("商品加入成功")

    if (isAuthenticated) {
      const productForCart = {
        id: product.id,
        name: product.name,
        price: discountedPrice,
        image: product.image,
        quantity: 1,
        Seller_ID: product.Seller_ID,
        Sell_quantity: product.Sell_quantity,
        Discount: product.Discount,
      }

      axios.post('api/add-cart', { product: productForCart }, { withCredentials: true })
        .then(res => {
          if (res.data.Status === "成功") {
            console.log("購物車更新成功", res.data)
          } else {
            alert(res.data.Error || "新增購物車失敗")
            console.log("回傳錯誤:", res.data)
          }
        })
        .catch(err => {
          console.error("伺服器問題，更新購物車失敗", err)
          if (err.response) {
            console.log("後端回應錯誤:", err.response.data)
          }
        })
    }
  }

  return (
    <Link to={`/product/${displayProduct.id}`}>
      <div className='bg-white p-4 shadow rounded relative border transform transition-transform duration-300 hover:scale-105'>

        {/* 折扣標籤 */}
        {displayProduct.Discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            -{displayProduct.Discount}%
          </div>
        )}

        <img src={displayProduct.image} alt="" className='w-full h-48 object-contain mb-4' />
        <h3 className='text-lg font-semibold'>{displayProduct.name}</h3>

        {/* 價格顯示 */}
        {displayProduct.Discount > 0 ? (
          <div className="text-gray-500">
            <p className="line-through text-sm text-red-400">${displayProduct.price}</p>
            <p className="text-green-600 font-bold text-lg">${discountedPrice}</p>
          </div>
        ) : (
          <p className='text-gray-500'>${displayProduct.price}</p>
        )}

        {/* 加入購物車按鈕 */}
        <div className={`absolute bottom-4 right-2 flex items-center justify-center w-8 h-8 
          ${displayProduct.Shelf_status === 2 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} 
          group text-white text-sm rounded-full transition-all duration-100
          ${displayProduct.Shelf_status !== 2 && 'hover:w-32'}`}
          onClick={(e) => {
            if (displayProduct.Shelf_status !== 2) {
              handleAddToCart(e, displayProduct)
            }
          }}
        >
          {displayProduct.Shelf_status === 2 ? (
            <span className='text-xs px-2'>缺貨</span>
          ) : (
            <>
              <span className='group-hover:hidden'>+</span>
              <span className='hidden group-hover:block'>加入購物車</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
