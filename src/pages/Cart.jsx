import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EmptyCart from "../assets/Images/EmptyCart.png"
import { Link, useNavigate } from 'react-router-dom'
import { FaTrashAlt } from 'react-icons/fa'
import Modal from '../components/Modal'
import ChangeAddress from '../components/ChangeAddress'
import { decreaseQuantity, increaseQuantity, removeFromCart } from '../redux/cartSlice'
import axios from "../../src/axios"
import Login from '../components/Login'

const Cart = ({openSignUp}) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const cart = useSelector(state => state.cart)
    const allProducts = useSelector(state => state.product.products);
    const [address, setAddress] = useState('main stret, 0012')
    const [isModelOpen, setIsModelOpen] = useState(false)
    const [isLoginModelOpen, setIsLoginModelOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
  return (
    <div className='container mx-auto py-8 min-h-96 px-4 md:px-16 lg:px-24'>
      {cart.products.length > 0 ? 
      <div>
        <h3 className='text-2xl font-semibold mb-4'>購物車</h3>
        <div className='flex flex-col md:flex-row justify-between space-x-10 mt-8'>
          <div className='md:w-2/3'>
            <div className='flex justify-between border-b items-center mb-4 text-xl font-bold'>
              <p>商品</p>
              <div className='flex space-x-8'>
                <p>單價</p>
                <p>數量</p>
                <p>總價錢</p>
                <p>刪除</p>
              </div>
            </div>
            <div>
              {cart.products.map((product)=>(
               
                  <div
                    key={product.id}
                    className='flex items-center justify-between p-3 border-b'
                  >
                      <div className='md:flex items-center space-x-4'>
                          <img src={product.image} alt="" className='w-16 h-16 object-contain rounded'/>
                          <div className='flex-1 ml-4'>
                              <h3 className='text-lg font-semibold'>{product.name}</h3>
                          </div>
                      </div>
                      <div className='flex space-x-12 items-center'>
                          <p>${product.price}</p>
                          <div className='flex items-center justify-center border'>
                              <button className='text-xl font-bold px-1.5 border-r' onClick={()=>{ 
                                  if(isAuthenticated){
                                  axios.post('http://localhost:3001/api/sub-cart',{product: {...product,quantity:-1}},{withCredentials:true})
                                  .then(res=>{
                                  if(res.data.Status ==="成功"){
                                    console.log("購物車更新成功",res.data);
                                  }
                                  else{
                                      alert(res.data.Error ||"新增購物車失敗");
                                      console.log("回傳錯誤:",res.data);
                                  }
                                  })
                                  .catch(err=>{
                                      console.error("伺服器問題，更新購物車失敗",err);
                                  if(err.response){
                                      console.log("後端回應錯誤:",err.response.data);
                                   }
                                   })

                                }

                              
                                 dispatch(decreaseQuantity(product.id))}}>-</button>
                              <p className='text-xl px-2'>{product.quantity}</p>
                              <button className='text-xl px-1 border-l' onClick={()=> {

                                  const currentQuantity = product.quantity;
                                  const maxQuantity = allProducts.find(item => item.id === product.id)?.quantity || 0;
                                  // console.log({currentQuantity});
                                  // console.log({maxQuantity});
                                   if (currentQuantity >= maxQuantity) {
                                      alert("超出庫存數量，無法新增商品！");
                                    return;
                                    }

                                if(isAuthenticated){
                                  axios.post('api/add-cart',{product: {...product,quantity:1}},{withCredentials:true})
                                  .then(res=>{
                                  if(res.data.Status ==="成功"){
                                    console.log("購物車更新成功",res.data);
                                  }
                                  else{
                                      alert(res.data.Error ||"新增購物車失敗");
                                      console.log("回傳錯誤:",res.data);
                                  }
                                  })
                                  .catch(err=>{
                                      console.error("伺服器問題，更新購物車失敗",err);
                                  if(err.response){
                                      console.log("後端回應錯誤:",err.response.data);
                                   }
                                   })

                                }
                                dispatch(increaseQuantity(product.id))}}
                                >+</button>
                          </div>
                          <p>${(product.price * product.quantity)}</p>
                          <button className='text-red-500 hover:text-red-700'
                              onClick={()=>{
                              if(isAuthenticated){
                                axios.delete(`api/remove-cart/${product.id}`, { withCredentials: true })
                                .then(res=>{
                                  if(res.data.Status==="成功"){
                                     console.log("商品刪除成功", res.data);
                                     dispatch(removeFromCart(product.id))
                                  }
                                  else{
                                    alert(res.data.error||"刪除失敗")
                                  }
                                })
                                .catch(err=>{
                                  console.log("伺服器錯誤，刪除失敗",err)
                                })
                              } 
                              else{
                                  dispatch(removeFromCart(product.id))
                              }
                              }
                              } 
                              
                          >
                                <FaTrashAlt />
                          </button>
                      </div>
                  </div>
              ))}
            </div>
          </div>

          <div className='md:w-1/3 bg-white p-6 rounded-lg shadow-md border'>
              <h3 className='text-sm font-semibold mb-5'>總金額</h3>
              <div className='flex justify-between mb-5 border-b pb-1'>
                   <span className='text-sm'>總數量:</span>
                  <span>{cart.totalQuantity}</span>
              </div>
              <div className='mb-4 border-b pb-2'>
                  <p>運輸:</p>
                  <p className='ml-2'>運送到{" "}
                  {/* <span className='text-xs font-bold'>{address}</span> */}
                  </p>
                  {/* <button className='text-blue-500 hover:underline mt-1 ml-2' onClick={()=> setIsModelOpen(true)}>改變地址</button> */}
              </div>
              <div className='flex justify-between mb-4'>
                  <span>總金額:</span>
                  <span>${cart.totalPrice}</span>
              </div>
              <button className='w-full bg-red-600 text-white py-2 hover:bg-red-800'
                  onClick={()=>{
                    if(isAuthenticated){
                        navigate('/checkout')
                      }
                    else{
                      alert("請先登入再結帳");
                      setIsLoginModelOpen(true);
                    }
                  }
                  }
              >結帳</button>
          </div>
        </div>
        <Modal isModelOpen={isModelOpen} setIsModelOpen={setIsModelOpen}>
          <ChangeAddress setAddress={setAddress} setIsModelOpen={setIsModelOpen}/>
        </Modal>

        <Modal isModelOpen={isLoginModelOpen} setIsModelOpen={setIsLoginModelOpen}>
          <Login openSignUp={openSignUp} setIsModelOpen={setIsLoginModelOpen}/>
        </Modal>
      </div>
      :
      <div className='flex flex-col items-center space-y-4 '>
        <img src={EmptyCart} alt="" className='h-96 object-contain' />
        <p className="text-2xl font-semibold flex justify-center">你的購物車目前是空的</p>
        <Link to="/Shop" className="text-red-600 text-sm md:text-xl font-semibold flex justify-center
         hover:underline transition duration-200 ">點擊我去逛逛吧!</Link>
      </div>
      }
    </div>
  )
}

export default Cart
