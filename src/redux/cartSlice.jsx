import {createSlice} from "@reduxjs/toolkit";

// const initialState ={
//     products:[],
//     totalQuantity: 0,
//     totalPrice: 0
// }

const loadCartFromLocalStorage = () => {
    try {
        const data = localStorage.getItem('cart');
        return data ? JSON.parse(data) : {products:[],totalQuantity: 0 , totalPrice: 0};
    }
    catch {
        return {products:[],totalQuantity: 0 , totalPrice: 0}
    }
};

const saveCartFromLocalStorage = (state) => {
    try{
        localStorage.setItem('cart',JSON.stringify(state));
    }
    catch (err){
        console.log('無法儲存購物車到localStorage',err);
    }
}

const initialState = loadCartFromLocalStorage();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
       addToCart(state,action){
        const newItem = action.payload;
        const finditem = state.products.find(item =>item.id === newItem.id )
        if(finditem){
            finditem.quantity++;
            finditem.totalPrice += newItem.price;
        }
        else{
            state.products.push({
                id: newItem.id,
                name: newItem.name,
                price: newItem.price,
                quantity: 1,
                totalPrice: newItem.price,
                image: newItem.image,
                Seller_ID: newItem.Seller_ID
            })
        }
        state.totalPrice += newItem.price;
        state.totalQuantity++;
        saveCartFromLocalStorage(state);
       },
       removeFromCart(state,action){
        const id = action.payload;
        const finditem = state.products.find((item) =>item.id === id )
        if(finditem){
            state.totalPrice -= finditem.totalPrice
            state.totalQuantity -= finditem.quantity
            state.products = state.products.filter(item => item.id !== id)
        }
        saveCartFromLocalStorage(state);
        },
        increaseQuantity(state,action){
            const id = action.payload;
            const finditem = state.products.find((item) =>item.id === id )
            if(finditem){
                finditem.quantity++;
                finditem.totalPrice += finditem.price;
                state.totalQuantity++;
                state.totalPrice += Number(finditem.price);
            }
            saveCartFromLocalStorage(state);
        },
        decreaseQuantity(state,action){
            const id = action.payload;
            const finditem = state.products.find((item) =>item.id === id )
            if(finditem.quantity > 1){  
                
                finditem.quantity--;
                finditem.totalPrice -= finditem.price;
                state.totalQuantity--;
                state.totalPrice -= finditem.price;
                }
                else {
                     state.totalQuantity -= finditem.quantity;  
                     state.totalPrice -= finditem.totalPrice;
                     state.products = state.products.filter(item => item.id !== id);
                }
                if(state.totalPrice < 0) state.totalPrice = 0;
                if(state.totalQuantity < 0) state.totalQuantity = 0;
            
            saveCartFromLocalStorage(state);
        },
        addMultipleToCart(state,action){
            const newItem = action.payload;
            const itemIndex = state.products.find((item)=> item.id === newItem.id);
            const totalAddPrice = newItem.price * newItem.quantity;

            if(itemIndex){
                itemIndex.quantity += newItem.quantity;
                itemIndex.totalPrice += totalAddPrice;
            }
            else{
                state.products.push({
                    id:newItem.id,
                    name:newItem.name,
                    price:newItem.price,
                    quantity: newItem.quantity,
                    totalPrice: totalAddPrice,
                    image: newItem.image,
                    Seller_ID: newItem.Seller_ID,
                })
            }
                state.totalQuantity += newItem.quantity;
                state.totalPrice += totalAddPrice;
                saveCartFromLocalStorage(state);
        },
        clearCart(state){
            state.products =[];
            state.totalQuantity = 0;
            state.totalPrice = 0;
            saveCartFromLocalStorage(state);
        },
        replaceCart(state,action){
            const newCart = action.payload;
            state.products = newCart.products ?? [];
            state.totalQuantity = Number(newCart.totalQuantity) || 0;
            state.totalPrice = Number(newCart.totalPrice) || 0;
            saveCartFromLocalStorage(state);
        },
        
    },
        
})

export const {addToCart,removeFromCart,increaseQuantity,decreaseQuantity,addMultipleToCart,clearCart,replaceCart} = cartSlice.actions
export default cartSlice.reducer