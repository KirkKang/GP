import axios from "../../src/axios"
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setAuth } from '../redux/authSlice'
import {  replaceCart } from '../redux/cartSlice'
const Login = ({openSignUp,setIsModelOpen}) => {
    const cart = useSelector(state => state.cart);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [values, setValues] = useState({
        email:'',
        password:''
    })

    axios.defaults.withCredentials = true;
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('api/login',values,{withCredentials:true})
        .then(res=>{
            console.log("登入API回應",res.data);
            if(res.data.Status ==="成功"){
                dispatch(setAuth(res.data.user));
                setIsModelOpen(false);
                console.log("登入成功",res);
                alert("登入成功")

                // const backendCart = res.data.cart;
                // console.log(backendCart);
                // if(backendCart){
                //     dispatch(replaceCart(backendCart));
                // }
               

            axios.get('api/get-cart',  {withCredentials:true})
            .then(cartRes => {
                if(cartRes.data.products){
                    console.log("抓到資料庫中的購物車了");
                    dispatch(replaceCart(cartRes.data));
                }
            })
            .catch(err=>console.error("取得購物車失敗",err));
            navigate('/');
            }
            else{
                alert(res.data.Error || "登入失敗");
            }
        })


         .catch(err => {
         console.log("登入fail",err)
         alert("SERVER錯誤");
         });
        }
    
    
  return (
    <div>
        <h2 className='text-2xl font-bold mb-4'>登入</h2>
        <form onSubmit={handleSubmit}>
            <div className='mb-4'>
                <label className='block text-gray-700'>信箱</label>
                <input type='email' className='w-full px-3 py-2 border' placeholder='輸入信箱' name='email'
                    onChange={e => setValues({...values,email: e.target.value})}
                />
            </div>

            <div className='mb-4'>
                <label className='block text-gray-700'>密碼</label>
                <input type='password' className='w-full px-3 py-2 border' placeholder='輸入密碼' name='password'
                    onChange={e => setValues({...values,password: e.target.value})}
                />
            </div>
            <div className='mb-4 flex items-center justify-between'>
                <label className='inline-flex items-center'>
                    <input type='checkbox' className='form-checkbox'></input>
                    <span className='ml-2 text-gray-700'>記住我</span>
                </label>
                    <a href='#' className='text-red-800'>忘記密碼?</a>
            </div>
            <div className='mb-4'>
                <button type='submit' className='w-full bg-red-600 text-white py-2'>登入</button>
            </div>
        </form>
        <div className='text-center'>
            <span className='text-gray-700'>還沒有帳號嗎?</span>
            <button className='text-red-800' onClick={openSignUp}>註冊</button>
        </div>
    </div>
  )
}

export default Login
