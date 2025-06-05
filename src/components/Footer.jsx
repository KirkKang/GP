import React from 'react'
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white py-8 px-4 md:mx-16 lg:px-24'>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className='text-xl font-semibold'>二手商店</h3>
          <p className='mt-4'>
            在二手商店可以找到你需要的或是想要販賣你用不到的商品都可以
          </p>
        </div>
        <div className='flex flex-col md:items-center'>
          <h4 className='text-lg font-semibold'>Quick Links</h4>
          <ul className='mt-4 space-y-2'>
            <li>
              <Link to="/" className='hover:underline'>首頁</Link>
            </li>
            <li>
              <Link to="/shop" className='hover:underline'>商品</Link>
            </li>
            <li>
              <Link to="/contact" className='hover:underline'>聯繫</Link>
            </li>
            <li>
              <Link to="/abouts" className='hover:underline'>關於</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className='text-lg font-semibold'>訂閱我們</h4>
          <div className='flex space-x-4 mt-4'>
            <a href="" className='hover:text-gray-400'><FaFacebook /></a>
            <a href="" className='hover:text-gray-400'><FaTwitter /></a>
            <a href="" className='hover:text-gray-400'><FaGithub /></a>
            <a href="" className='hover:text-gray-400'><FaLinkedin /></a>
          </div>
          <form className='flex items-center justify-center mt-8'>
            <input type="email" placeholder='輸入信箱' 
            className='w-full p-2 rounded-l-lg bg-gray-800 border border-gray-600' />
            <button className='bg-red-600 text-white px-4 py-2 rounded-r-lg whitespace-nowrap'>訂閱</button>
          </form>
        </div>
      </div>
      <div className='mt-8 border-t border-gray-700 pt-4'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
          <p>&copy; 2025 二手商店</p>
          {/* <div className='flex space-x-6 md:mt-0'>
            <a href="" className='hover:underline'>Privacy Policy</a>
            <a href="" className='hover:underline'>Terms & Conditions</a>
          </div> */}
        </div>
      </div>
    </footer>
  )
}

export default Footer
