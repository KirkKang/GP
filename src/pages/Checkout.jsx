import axios from "../../src/axios"
import React, { useEffect, useState } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../redux/cartSlice'
import { setOrder1 } from '../redux/orderSlice'

const Checkout = ({setOrder}) => {
    const dispatch = useDispatch()

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [billingToggle, setBillingToggle] = useState(true)
    const [shippingToggle, setShippingToggle] = useState(false)
    const [paymentToggle, setPaymentToggle] = useState(false)

    const [paymentMethod, setPaymentMethod] = useState("cc")

    const [billingInfo, setBillingInfo] = useState({
        name:'',
        email:'',
        phone:''
    })

    const [shippingInfo, setShippingInfo] = useState({
        // city:'',
        address:'',
        zip:''
    })

    const [creditCard, setCreditCard] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: "",
    });

    const [creditCardError, setCreditCardError] = useState({});

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // 移除非數字字元
        value = value.substring(0, 16); // 最多16碼
        // 每4碼加一個空格
        const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
        setCreditCard({...creditCard, number: formattedValue});
    };


    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // 移除非數字字元
        if (value.length > 4) value = value.substring(0,4); // 最多4碼 MMYY

        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        setCreditCard({...creditCard, expiry: value});
    };


    const [error, setError] = useState({});

    const cart = useSelector(state => state.cart)
    const auth = useSelector(state => state.auth)
    const allProducts = useSelector(state => state.product.products);
    
    const navigate = useNavigate()



    useEffect(()=>{
         console.log('auth data:', auth);
        if(auth.isAuthenticated && auth.user){
            setBillingInfo({
                name: auth.user.name || "",
                email: auth.user.email || "",
                phone: auth.user.phone || "",
            })
            setShippingInfo(prev=>({
                ...prev,
                address: auth.user.address || prev.address
            }))
        }
    },[auth])

    const validateForm = () => {
        let errs ={}

        if(!billingInfo.name.trim()) errs.name = "請輸入姓名"
        if(!billingInfo.email.trim()) errs.email = "請輸入信箱"
        if(!billingInfo.phone.trim()) errs.phone = "請輸入電話"
        if(!shippingInfo.address.trim()) errs.address = "請輸入地址"
        if(!shippingInfo.zip.trim()) errs.zip = "請輸入郵遞區號"


         if(paymentMethod === "cc") {
    const cardNumberOnly = creditCard.number.replace(/\s/g, '');
    if (!cardNumberOnly || !/^\d{16}$/.test(cardNumberOnly)) {
      errs.cardNumber = "請輸入有效的 16 位數信用卡號";
    }
    if (!creditCard.name.trim()) {
      errs.cardName = "請輸入持卡人姓名";
    }
    if (!/^\d{2}\/\d{2}$/.test(creditCard.expiry)) {
      errs.expiry = "請輸入有效的日期格式 MM/YY";
    } else {
      const [mm, yy] = creditCard.expiry.split('/').map(Number);
      const currentDate = new Date();
      const expiryDate = new Date(2000 + yy, mm -1, 1);
      if (isNaN(expiryDate) || expiryDate < currentDate) {
        errs.cardExpiry = "信用卡已過期，請輸入有效日期";
      }
    }
    if (!/^\d{3}$/.test(creditCard.cvv)) {
      errs.cardCVV = "請輸入 3 位數驗證碼";
    }
  }
        setError(errs)
            return Object.keys(errs).length === 0
    }

    const handleOrder =  async () => {
         const cartItems = cart.products;
         const stockIssues = cartItems.filter(cartItem => {
            const matchedProduct = allProducts.find(p => p.id === cartItem.id);
            return matchedProduct && cartItem.quantity > matchedProduct.quantity;
         })

         if(stockIssues.length > 0){
            alert("以下商品的購買數量超過庫存:\n" +
                stockIssues.map(item =>{
                    const stock = allProducts.find(p => p.id ===item.id)?.quantity ?? 0;
                    return `「${item.name}」購買 ${item.quantity} 件，庫存僅剩 ${stock} 件`;
                }).join("\n")
             );
             return;
         }

         if (isSubmitting) return;
            setIsSubmitting(true);
        let valid = true ;
        let errors = {} ;

        if (paymentMethod === "cc") {
    // 信用卡號：16位數字
    const cardNumberOnly = creditCard.number.replace(/\s/g, '');
    if (!cardNumberOnly || !/^\d{16}$/.test(cardNumberOnly)) {
      errors.number = "請輸入有效的 16 位數信用卡號";
      valid = false;
    }

    // 姓名：不可空白
    if (!creditCard.name.trim()) {
      errors.name = "請輸入持卡人姓名";
      valid = false;
    }

    // 有效日期：格式 MM/YY 且非過去時間
    if (!/^\d{2}\/\d{2}$/.test(creditCard.expiry)) {
      errors.expiry = "請輸入有效的日期格式 MM/YY";
      valid = false;
    } else {
      const [mm, yy] = creditCard.expiry.split('/').map(Number);
      const currentDate = new Date();
      const expiryDate = new Date(2000 + yy, mm -1,1); // 該月結束
      if (isNaN(expiryDate) || expiryDate < currentDate) {
        errors.expiry = "信用卡已過期，請輸入有效日期";
        valid = false;
      }
    }

    // CVV 驗證碼：3位數字
    if (!/^\d{3}$/.test(creditCard.cvv)) {
      errors.cvv = "請輸入 3 位數驗證碼";
      valid = false;
    }
  }

        setCreditCardError(errors);
        setIsSubmitting(false);

        if(!validateForm()) return 

        if(cart.products.length ===0){
            alert("購物車是空的，請先去添加商品")
            return
        }

        const newOrder = {
  order_number: Date.now().toString(),
  billing_name: billingInfo.name,
  billing_email: billingInfo.email,
  billing_phone: billingInfo.phone,
  shipping_address: shippingInfo.address,
  shipping_zip: shippingInfo.zip,
  payment_method: paymentMethod,
  total_price: cart.totalPrice,
  items: cart.products.map(p => ({
    product_id: p.id,    // 確認你的 product id 欄位叫 id
    product_name: p.name,
    quantity: p.quantity,
    price: p.price,
    Seller_ID:p.Seller_ID
  }))
};
        try {
    const res = await axios.post('api/orders', newOrder, { withCredentials: true });
    if (res.data.Status === "成功") {
      console.log("訂單已新增，訂單ID：", res.data.orderId);
      setOrder(newOrder);
      dispatch(setOrder1(newOrder));
      localStorage.setItem("latestOrder", JSON.stringify(newOrder));
      dispatch(clearCart());
      navigate('/order-confirmation');
    }
  } catch (error) {
    console.error("新增訂單失敗:", error.response?.data || error.message);
    alert("新增訂單失敗：" + (error.response?.data?.error || error.message));
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className='container mx-auto py-8 min-h-96 px-4 md:px-16 lg:px-24'>   
        <h3 className='text-2xl font-semibold mb-4'>結帳區</h3>
        <div className='flex flex-col md:flex-row justify-between space-x-10 mt-8'>
          <div className='md:w-2/3'>
                <div className='border p-2 m-6'>
                    <div className='flex items-center justify-between'
                        onClick={()=> setBillingToggle(!billingToggle)}>
                        <h3 className='text-lg font-semibold mb-2'>帳單資訊</h3>
                        { billingToggle ? <FaAngleDown /> : <FaAngleUp />  }
                    </div>
                    <div className={`space-y-4  ${billingToggle ? "" : "hidden"  }`}>
                    
                        <div>
                            <label className='block text-gray-700'>名字</label>
                            <input type='text' name="name" placeholder='輸入名字' className='w-full px-3 py-2 border'
                                value={billingInfo.name} onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                            />
                            {error.name && <p className='text-red-500 text-sm'>{error.name}</p>}
                        </div>
                        <div >
                        <label className='block text-gray-700'>信箱</label>
                            <input type='email' name="email" placeholder='請輸入信箱' className='w-full px-3 py-2 border' 
                                value={billingInfo.email} onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                            />
                            {error.email && <p className='text-red-500 text-sm'>{error.email}</p>}
                        </div>
                        <div>
                        <label className='block text-gray-700'>電話</label>
                        <input type='text' name="phone" placeholder='請輸入電話' className='w-full px-3 py-2 border' 
                            value={billingInfo.phone} onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                        />
                            {error.phone && <p className='text-red-500 text-sm'>{error.phone}</p>}
                        </div>
                    </div>
                </div>
                {/* shipping */}
                <div className='border p-2 m-6'>
                    <div className='flex items-center justify-between'
                        onClick={()=> setShippingToggle(!shippingToggle)}>
                        <h3 className='text-lg font-semibold mb-2'>配送資訊</h3>
                        { shippingToggle ? <FaAngleDown /> : <FaAngleUp />  }
                    </div>
                    <div className={`space-y-4  ${shippingToggle ? "" : "hidden"  }`}>
                    
                        {/* <div>
                            <label className='block text-gray-700'>縣市</label>
                            <input type='text' name="city" placeholder='請輸入縣市' className='w-full px-3 py-2 border'
                             onChange={(e)=>setShippingInfo({...shippingInfo,city: e.target.value})}/>
                        </div> */}
                        <div >
                            <label className='block text-gray-700'>地址</label>
                            <input type='text' name="address" placeholder='請輸入地址' className='w-full px-3 py-2 border'
                             value={shippingInfo.address} onChange={(e)=>setShippingInfo({...shippingInfo,address: e.target.value})} />
                             {error.address && <p className='text-red-500 text-sm'>{error.address}</p>}
                        </div>
                        <div>
                            <label className='block text-gray-700'>郵遞區號</label>
                            <input type='text' name="zip" placeholder='請輸入郵遞區號' className='w-full px-3 py-2 border'
                             value={shippingInfo.zip} onChange={(e)=>setShippingInfo({...shippingInfo,zip: e.target.value})}/>
                             {error.zip && <p className='text-red-500 text-sm'>{error.zip}</p>}
                        </div>
                    </div>
                </div>
                {/* payment method */}
                <div className='border p-2 m-6'>
                    <div className='flex items-center justify-between'
                        onClick={()=> setPaymentToggle(!paymentToggle)}>
                        <h3 className='text-lg font-semibold mb-2'>付款方式</h3>
                        { paymentToggle ? <FaAngleDown /> : <FaAngleUp />  }
                    </div>
                    <div className={`space-y-4  ${paymentToggle ? "" : "hidden"  }`}>
                    
                        <div className='flex items-center mb-2'>
                            <input type='radio' name="payment" checked = {paymentMethod === "cc"} onChange={()=> setPaymentMethod("cc")}/>
                            <label className='block text-gray-700 ml-2'>信用卡支付</label>
                        </div>
                        <div className='flex items-center mb-2'>
                            <input type='radio' name="payment" checked = {paymentMethod === "cod"} onChange={()=> setPaymentMethod("cod")}/>
                            <label className='block text-gray-700 ml-2'>貨到付款</label>
                        </div>
                    
                    {paymentMethod === "cc" && (
                        <div className='bg-gray-100 p-4 rounded-lg mb-4'>
                            <h3 className='text-xl font-semibold mb-4'>信用卡資訊</h3>
                            <div className='mb-4'>
                                <label className='block text-gray-700 font-semibold mb-2'>信用卡號</label>
                                <input type='text' placeholder="請輸入卡號" className='border p-2 w-full rounded' required
                                    value={creditCard.number} onChange={handleCardNumberChange}
                                />
                                {creditCardError.number && <p className="text-red-500 text-sm">{creditCardError.number}</p>}
                            </div>
                            <div className='mb-4'>
                                <label className='block text-gray-700 font-semibold mb-2'>持卡人姓名</label>
                                <input type='text' placeholder="請輸入姓名" className='border p-2 w-full rounded' required
                                    value={creditCard.name} onChange={(e) => setCreditCard({...creditCard, name: e.target.value})}
                                />
                                {creditCardError.name && <p className="text-red-500 text-sm">{creditCardError.name}</p>}
                            </div>
                            <div className='flex justify-between mb-4'>
                                <div className='w-1/2 mr-2'>
                                    <label className='block text-gray-700 font-semibold mb-2'>有效日期</label>
                                    <input type='text' placeholder="MM/YY" className='border p-2 w-full rounded' required
                                        value={creditCard.expiry} onChange={handleExpiryChange}
                                    />
                                    {creditCardError.expiry && <p className="text-red-500 text-sm">{creditCardError.expiry}</p>}
                                </div>
                                <div className='w-1/2 ml-2'>
                                    <label className='block text-gray-700 font-semibold mb-2'>驗證碼</label>
                                    <input type='text' placeholder="CVV" className='border p-2 w-full rounded' required
                                        maxLength={3} value={creditCard.cvv} onChange={(e) => {// 限制只能輸入數字，且長度最多3
                                        const val = e.target.value.replace(/\D/g, '').substring(0, 3);
                                        setCreditCard({...creditCard, cvv: val});
                                    }}
                                    />
                                        {creditCardError.cvv && <p className="text-red-500 text-sm">{creditCardError.cvv}</p>}
                                </div>
                            </div>
                        </div>
                    ) }
                    </div>
                </div>
          </div>

          <div className='md:w-1/3 bg-white p-6 rounded-lg shadow-md border'>
              <h3 className='text-lg font-semibold mb-4'>訂單資訊</h3>
              <div className='space-y-4'>
                  {cart.products.map(product => (
                        <div key={product.id} className='flex justify-between'>
                            <div className='flex items-center'>
                                <img src={product.image} alt={product.name} className='w-16 h-16 object-contain rounded' />
                                <div className='ml-4'>
                                    <h4 className='text-md font-semibold'>{product.name}</h4>
                                    <p className='text-gray-600'> ${product.price} x {product.quantity}</p>
                                </div>
                            </div>
                            <div className='text-gray-800'>
                                ${product.price * product.quantity}
                            </div>
                        </div>
                  ))}
              </div>
              <div className='mt-4 border-t pt-4'>
                  <div className='flex justify-between'>
                    <span>總價錢:</span>
                    <span className='font-semibold'>${cart.totalPrice}</span>
                  </div>
              </div>
              <button className='w-full bg-red-600 text-white py-2 mt-6 hover:bg-red-800' onClick={handleOrder}disabled={isSubmitting}>
                {isSubmitting ? "處理中..." : "送出訂單"}</button>
          </div>
        </div>
    </div>
  )
}

export default Checkout