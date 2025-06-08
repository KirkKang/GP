import {createSlice} from "@reduxjs/toolkit";

const initialState ={
    products:[],
    searchTerm: '',
    filteredData: [],
    sellerProducts: [],
    sellers: [],
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
                product.name.toLowerCase().includes(state.searchTerm.toLowerCase()) &&
                product.Shelf_status !== 0 
            )
        },
        setSellerProducts(state, action){
            const sellerId = action.payload
            state.sellerProducts = state.products.filter(product=>
                product.Seller_ID === sellerId &&
                product.Shelf_status !== 0
            )
        },
        setSellers(state, action) {
            state.sellers = action.payload; 
        }
        
        
    },
        
})

export const {setProducts,setSearchTerm,setSellerProducts,setSellers} = productSlice.actions;
export default productSlice.reducer