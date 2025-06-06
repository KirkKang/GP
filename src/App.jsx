import { BrowserRouter,Routes,Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import { useEffect, useState } from "react"
import Order from "./pages/Order"
import FilterData from "./pages/FilterData"
import ProductDetail from "./pages/ProductDetail"
import { useDispatch, useSelector } from "react-redux"
import { setProducts } from "./redux/productSlice"
import { mockData } from "./assets/mockData"
// import axios  from "axios"
import RequireAuth from "./components/RequireAuth"
import { setAuth, setLoading } from "./redux/authSlice"
import UserInformation from "./pages/UserInformation"
import UserOrderInformation from "./pages/UserOrderInformation"
import Contact from "./pages/Contact"
import Abouts from "./pages/Abouts"
import axios from "./axios"
// import ProductList from "./ProductList"
function App() {
  const authState = useSelector(state => state.auth);
console.log("App 檢查 auth 狀態：", authState);
  const dispatch = useDispatch()

  const [order, setOrder] = useState(null)

  // useEffect(()=>{
  //   dispatch((setProducts(mockData)))
  // },[dispatch])


  useEffect(()=>{
    dispatch (setLoading(true));
    const fetchProducts = async () => {
      try {
          const res = await axios.get("api/products")
          dispatch(setProducts(res.data))
          console.log(res.data)
      }
      catch(error){
        console.log("fail",error)
      }
    };
    fetchProducts()
  },[dispatch])

   

   useEffect(() => {
    axios.get("api/verify", { withCredentials: true })
      .then(res => {
        if (res.data.user) {
          dispatch(setAuth(res.data.user))
        }
      })
      .catch(err => console.log("登入狀態檢查失敗", err))
  }, [dispatch])

  

  return (
    <BrowserRouter basename="/">
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/shop" element={<Shop/>}></Route>
        <Route path="/cart" element={<Cart/>}></Route>
        <Route path="/contact" element={<Contact/>}></Route>
        <Route path="/abouts" element={<Abouts/>}></Route>
        
        <Route element={<RequireAuth />}>
        <Route path="/checkout" element={<Checkout setOrder={setOrder}/>}></Route>
        <Route path="/order-confirmation" element={<Order order={order}/>}></Route>
        <Route path="/userinfo" element={<UserInformation/>}></Route>
        <Route path="/userorderinfo" element={<UserOrderInformation/>}></Route>
        </Route>

        <Route path="/filter-data" element={<FilterData/>}></Route>
        <Route path="/product/:id" element={<ProductDetail/>}></Route>

        
        {/* <Route path="/products" element={<ProductList />} /> */}
      </Routes>
    
    <Footer/>
    </BrowserRouter>
  )
}

export default App
