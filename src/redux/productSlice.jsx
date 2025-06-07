import {createSlice} from "@reduxjs/toolkit";

const initialState ={
    products:[],
    searchTerm: '',
    filteredData: [],
    sellerProducts: [],
}

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts(state,action){
            state.products = action.payload
        },
        setSearchTerm(state,action){
            state.searchTerm = action.payload
            state.filteredData = state.products.filter(product =>
                product.name.toLowerCase().includes(state.searchTerm.toLowerCase())
            )
        },
        setSellerProducts(state, action){
            const sellerId = action.payload
            state.sellerProducts = state.products.filter(product=>
                product.Seller_ID === sellerId
            )
        }
        
    },
        
})

export const {setProducts,setSearchTerm,setSellerProducts} = productSlice.actions;
export default productSlice.reducer