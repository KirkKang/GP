import axios from "../../src/axios"
import React, { useEffect, useState } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../redux/cartSlice'
import { setOrder1 } from '../redux/orderSlice'
import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js"

const CARD_INPUT_STYLE = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': { color: '#aab7c4' },
      padding: '12px 14px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: 'white',
      height: '45px',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true,
};


const Checkout = ({setOrder}) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch()

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [billingToggle, setBillingToggle] = useState(true)
    const [shippingToggle, setShippingToggle] = useState(false)
    const [paymentToggle, setPaymentToggle] = useState(false)
    const [error, setError] = useState({});

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

    
        const validate = () => {
        const newError = {};
        if (!billingInfo.name) newError.name = "請輸入名字";
        if (!billingInfo.email) newError.email = "請輸入信箱";
        if (!billingInfo.phone) newError.phone = "請輸入電話";
        if (!shippingInfo.address) newError.address = "請輸入地址";
        if (!shippingInfo.zip) newError.zip = "請輸入郵遞區號";
        setError(newError);
        return Object.keys(newError).length === 0;
        };


    const handleOrder =  async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (!stripe || !elements) {
            alert("Stripe 尚未初始化，請稍後再試");
            setIsSubmitting(false);
            return;
        }


        if (!validate()) {
            alert("請填寫完整資訊");
            setIsSubmitting(false);
        return;
        }
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
             setIsSubmitting(false);
             return;
         }
        if(cart.products.length ===0){
            alert("購物車是空的，請先去添加商品")
             setIsSubmitting(false);
            return
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        if (!cardNumberElement && paymentMethod === "cc") {
            alert("請輸入信用卡資訊");
            setIsSubmitting(false);
        return;
        }



       try {
    let paymentSucceeded = true; // 預設貨到付款也算成功

    if (paymentMethod === "cc") {
      if (!stripe || !elements) {
        alert("Stripe 尚未初始化，請稍後再試");
        setIsSubmitting(false);
        return;
      }

      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        alert("請輸入信用卡資訊");
        setIsSubmitting(false);
        return;
      }

      // Step 1: 從後端建立 PaymentIntent 拿 clientSecret
      const paymentRes = await axios.post('/create-payment-intent',
        { amount: Math.round(cart.totalPrice * 100) },  // 分為分單位
        { withCredentials: true }
      );

      const clientSecret = paymentRes.data.clientSecret;

      // Step 2: 呼叫 Stripe 付款流程
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: billingInfo.name,
            email: billingInfo.email,
            phone: billingInfo.phone,
          },
        },
      });

      if (paymentResult.error) {
        alert("付款失敗：" + paymentResult.error.message);
        setIsSubmitting(false);
        return;
      }

      if (paymentResult.paymentIntent.status !== "succeeded") {
        alert("付款未成功");
        setIsSubmitting(false);
        return;
      }
    } else if (paymentMethod === "cod") {
      // 貨到付款不須Stripe付款，直接通過
      paymentSucceeded = true;
    }

    if (paymentSucceeded) {
      // Step 3: 付款成功，送訂單資料到後端
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
          product_id: p.id,
          product_name: p.name,
          quantity: p.quantity,
          price: p.price,
          Seller_ID: p.Seller_ID,
        })),
      };

      const orderRes = await axios.post('/api/orders', newOrder, { withCredentials: true });
      if (orderRes.data.Status === "成功") {
        setOrder(newOrder);
        dispatch(setOrder1(newOrder));
        localStorage.setItem("latestOrder", JSON.stringify(newOrder));
        dispatch(clearCart());
        navigate('/order-confirmation');
      } else {
        alert("訂單建立失敗");
      }
    }
  } catch (error) {
    alert("錯誤：" + (error.response?.data?.error || error.message));
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
                        <div className="flex flex-col space-y-4">
      <label>信用卡號</label>
      <div className="border rounded">
        <CardNumberElement options={CARD_INPUT_STYLE} />
      </div>

      <label>有效期限</label>
      <div className="border rounded">
        <CardExpiryElement options={CARD_INPUT_STYLE} />
      </div>

      <label>CVC</label>
      <div className="border rounded">
        <CardCvcElement options={CARD_INPUT_STYLE} />
      </div>
    </div>
                    )}

                    {paymentMethod === "cod" && (
                        <div className='mt-4'>
                            <p>貨到付款請準備現金</p>
                        </div>
                    )}

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