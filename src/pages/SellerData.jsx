import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from '../components/ProductCard'
import NoProduct from '../assets/Images/noproduct.png'
import { setSellerProducts } from '../redux/productSlice'
const SellerData = () => {
    const { id } = useParams(); // Seller_ID
    const dispatch = useDispatch();

    const products = useSelector(state => state.product.products);
    const sellerProducts = useSelector(state => state.product.sellerProducts);
    const sellers = useSelector(state => state.product.sellers);
    const sellerInfo = sellers?.length ? sellers.find(seller => seller.Seller_ID === id) : null;

    useEffect(() => {
        if(products.length > 0){
        dispatch(setSellerProducts(id));
        }
    }, [dispatch, id, products]);

    return (
         <div className='mx-auto py-12 px-4 md:px-16 lg:px-24'>
            {sellerInfo && (
                <div className='mb-10 text-center'>
                    <h2 className='text-2xl font-bold mb-2'>商場名稱：{sellerInfo.Company}</h2>
                    <p className='text-gray-600'>{sellerInfo.Seller_introduction}</p>
                </div>
            )}

            {sellerProducts.length > 0 ? (
                <>
                    <h2 className='text-2xl font-bold mb-6 text-center'>此賣家的其他商品</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 cursor-pointer'>
                        {sellerProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </>
            ) : (
                <div className='flex flex-col justify-center'>
                    <img src={NoProduct} alt='' className='w-full h-[600px] object-contain mb-4' />
                    <h2 className='mt-4 text-lg font-semibold text-center'>這位賣家目前沒有商品或是已下架</h2>
                </div>
            )}
        </div>
    );
};

export default SellerData
