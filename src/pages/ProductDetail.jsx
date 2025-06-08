import React, { useEffect, useState } from 'react'
import { FaCarSide, FaQuestion } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { addMultipleToCart } from '../redux/cartSlice'
import axios from "../../src/axios"

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  
  const products = useSelector(state => state.product.products)
  const cartItems = useSelector(state => state.cart.products)

  const [product, setProduct] = useState()
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id)
    if (foundProduct) {
      const transformedProduct = {
        ...foundProduct,
        Shelf_status: (foundProduct.quantity === 0 && foundProduct.Shelf_status !== 0) ? 2 : foundProduct.Shelf_status
      }
      setProduct(transformedProduct)
    }
  }, [id, products])

  const handleAddToCart = (e) => {
    e.preventDefault()

    if (product.Shelf_status === 2 || product.quantity === 0) {
      alert("此商品已下架或數量為 0，無法加入購物車")
      return
    }

    const currentCartItem = cartItems.find(item => item.id === product.id)
    const existingQty = currentCartItem ? currentCartItem.quantity : 0
    const requestedQty = parseInt(quantity)
    const totalQty = existingQty + requestedQty
    const discountedPrice = Math.round(product.price * (1 - product.Discount / 100) * 100) / 100


    if (totalQty > product.quantity) {
      alert(`庫存不足，您已選擇 ${existingQty} 件，最多只能再加 ${product.quantity - existingQty} 件。`)
      return
    }

    const newItem = {
      ...product,
      price: discountedPrice,
      quantity: requestedQty
    }

    dispatch(addMultipleToCart(newItem))
    alert("商品加入成功")

    if (isAuthenticated) {
      axios.post('api/add-cart', { product: newItem }, { withCredentials: true })
        .then(res => {
          if (res.data.Status === "成功") {
            console.log("購物車更新成功", res.data)
          } else {
            alert(res.data.error || "新增購物車失敗")
            console.error("後端錯誤：", res.data)
          }
        })
        .catch(err => {
          console.error("伺服器錯誤，更新購物車失敗", err)
        })
    }
  }

  if (!product || product.Shelf_status === 0) {
    return <div>此商品已下架或不存在</div>
  }

  const isDisabled = product.Shelf_status === 2 || product.quantity === 0
  const discountedPrice = Math.round(product.price * (1 - product.Discount / 100) * 100) / 100

  return (
    <div className='container mx-auto py-8 px-4 md:px-16 lg:px-24'>
      <div className='flex flex-col md:flex-row gap-x-16'>
        <div className='md:w-1/2 py-4 shadow-md md:px-8 h-96 flex justify-center'>
          <img src={product.image} alt={product.name} className='h-full' />
        </div>

        <div className='md:w-1/2 p-4 shadow-md md:p-16 flex flex-col items-center gap-y-2'>
          <h2 className='text-3xl font-semibold mb-2'>{product.name}</h2>

          {/* 顯示折扣價格 */}
          {product.Discount > 0 ? (
            <div className="text-center">
              <p className="line-through text-sm text-red-400">${product.price}</p>
              <p className="text-green-600 font-bold text-xl">${discountedPrice}</p>
            </div>
          ) : (
            <p className='text-xl font-semibold text-gray-800 mb-4'>${product.price}</p>
          )}

          <form onSubmit={handleAddToCart}>
            <input
              id="quantity"
              type='number'
              min='1'
              max={product.quantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className='border p-1 w-16'
              disabled={isDisabled}
            />
            <button
              type="submit"
              className='bg-red-600 text-white py-1.5 px-4 hover:bg-red-800 ml-2'
              disabled={isDisabled}
            >
              {isDisabled ? '缺貨' : '加入購物車'}
            </button>
          </form>

          <div className='flex flex-col gap-y-4 mt-4'>
            <Link to={`/seller/${product.Seller_ID}`} className='text-blue-600 hover:underline'>
              查看此賣家其他商品
            </Link>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <h3 className='text-xl font-semibold mb-2'>產品資訊</h3>
        <p>{product.Product_introduction}</p>
      </div>
    </div>
  )
}

export default ProductDetail
