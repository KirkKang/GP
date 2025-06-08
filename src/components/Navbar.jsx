import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Modal from './Modal'
import Login from './Login'
import Register from './Register'
import { setSearchTerm } from '../redux/productSlice'
import axios from "../../src/axios"
import { clearAuth, setAuth } from '../redux/authSlice'
import { clearCart } from '../redux/cartSlice'
const Navbar = () => {
    const [isModelOpen, setIsModelOpen] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const [search, setSearch] = useState()

   const [showUser, setShowUser] = useState(false)
   const dropShowUserRef = useRef(null);

    const {isAuthenticated, user} = useSelector(state => state.auth)
    const location = useLocation();
    useEffect(()=>{
        axios.get('api/verify',{withCredentials: true})
        .then(res=>{
            if(res.data.Status === "成功"){
                console.log("登入成功取得token");
                dispatch(setAuth(res.data.user));
                
            }
            else{
                dispatch(clearAuth());
                console.log("登入失敗沒有取得token")
                
            }
        })
        .catch(err => {
            dispatch(clearAuth());
            console.log(err);
        })
    },[location])


    useEffect(() => {
  function handleClickOutside(event) {
    if (dropShowUserRef.current && !dropShowUserRef.current.contains(event.target)) {
      setShowUser(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        dispatch(setSearchTerm(search))
        navigate('/filter-data')
    }

    const openSignUp = () => {
        setIsLogin(false)
        setIsModelOpen(true)
    }

    const openLogin = () => {
        setIsLogin(true)
        setIsModelOpen(true)
    }

    const handleLogout = (e) => {
        e.preventDefault();
        axios.get('api/logout',{
            withCredentials:true
        })
        .then(res => {
            dispatch(clearAuth());
            dispatch(clearCart());
            setShowUser(false);
            navigate('/');
        }).catch(err => console.log(err));
    }

    const products = useSelector(state => state.cart.products)

  return (
    <nav className='bg-gray-100 shadow-md'>
        <div className='container mx-auto px-4 md:px-16 lg:px-24 py-4 flex justify-between items-center'>
            <div className='text-lg font-bold'>
                <Link to="/" >二手販賣網站</Link>
            </div>
            <div className='relative flex-1 mx-4'>
                <form onSubmit={handleSearch}>
                    <input type="text" placeholder='搜尋' className='w-full border py-2 px-4' onChange={(e) => setSearch(e.target.value)} />
                    <button type='submit'>
                    <FaSearch className='absolute top-3 right-3 text-red-500 cursor-pointer hover:text-red-700'></FaSearch>
                    </button>
                </form>
            </div>
            <div className='flex items-center space-x-4'>
                <Link to="/cart" className='relative'>
                    <FaShoppingCart className='text-lg'/>
                    {products.length > 0 && (
                    <span className='absolute top-0 text-xs w-3 left-3 bg-red-600 rounded-full flex justify-center items-center text-white'>
                        {products.length}
                    </span>
                    )}
                </Link>
            { !isAuthenticated ? (
                <button className='hidden md:block' onClick={()=> setIsModelOpen(true)}>
                    登入 | 註冊
                </button>
                    ) :(
              <div className="relative" ref={dropShowUserRef}>
                    <button onClick={() => setShowUser(prev => !prev)} className="text-lg mt-2 ml-2">
                    <FaUser />
                    </button>    
                    {showUser && (
                    <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md p-3 z-50 text-sm space-y-2">
                        <p className="text-gray-700 border-b pb-2">{user.name+"會員"}</p>
                        <button onClick={() => navigate('/userinfo')}
                            className="w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
                        >用戶資料
                        </button>
                        <button onClick={() => navigate('/userorderinfo')}
                            className="w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
                        >訂單資訊
                        </button>
                        <button onClick={handleLogout}
                            className="w-full text-left text-red-500 hover:bg-gray-100 px-2 py-1 rounded"
                        >登出
                        </button>
                    </div>
                                )
                    }                   
              </div>
            )}
                <div className="relative block md:hidden" ref={dropShowUserRef}>
  <button onClick={() => setShowUser(prev => !prev)} className="text-lg">
    <FaUser />
  </button>
  {showUser && (
    <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md p-3 z-50 text-sm space-y-2">
      {!isAuthenticated ? (
        <>
          <button
            onClick={() => {
              setShowUser(false);
              setIsModelOpen(true); // 顯示登入註冊 modal
            }}
            className="w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
          >
            註冊 | 登入
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-700 border-b pb-2">{user.name + "會員"}</p>
          <button
            onClick={() => {
              setShowUser(false);
              navigate('/userinfo');
            }}
            className="w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
          >
            用戶資料
          </button>
          <button
            onClick={() => {
              setShowUser(false);
              navigate('/userorderinfo');
            }}
            className="w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
          >
            訂單資訊
          </button>
          <button
            onClick={() => {
              setShowUser(false);
              handleLogout();
            }}
            className="w-full text-left text-red-500 hover:bg-gray-100 px-2 py-1 rounded"
          >
            登出
          </button>
        </>
      )}
    </div>
  )}
</div>
 

            </div>
        </div>
        <div className='flex items-center justify-center space-x-10 py-4 text-sm font-bold'>
            <Link to='/' className='hover:underline'>
                首頁
            </Link>
            <Link to='/shop' className='hover:underline'>
                商品
            </Link>
            {/* <Link to='/contact' className='hover:underline'>
                聯繫
            </Link>
            <Link to='/abouts' className='hover:underline'>
                關於
            </Link> */}
        </div>
        <Modal isModelOpen={isModelOpen} setIsModelOpen={setIsModelOpen}>
            {isLogin ? <Login openSignUp={openSignUp}  setIsModelOpen={setIsModelOpen}/> : <Register openLogin={openLogin} /> }
        </Modal>
    </nav>
  )
}

export default Navbar
