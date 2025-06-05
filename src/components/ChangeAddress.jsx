import React, { useState } from 'react'

const ChangeAddress = ({setAddress, setIsModelOpen}) => {
    const [newAddress ,setNewAddress] = useState("")
    const onClose = () => {
        setAddress(newAddress)
        setIsModelOpen(false)
    }
  return (
    <div>
        <input type="text" placeholder='輸入新地址' className='border p-2 w-full mb-4' 
            onChange={(e) => setNewAddress(e.target.value)}
        />
        <div className=' flex justify-end'>
            <button className='bg-gray-500 text-white py-2 px-4 rounded mr-2' onClick={()=>setIsModelOpen(false)}>取消</button>
            <button className='bg-blue-500 text-white py-2 px-4 rounded' onClick={onClose}>儲存</button>
        </div>
    </div>
  )
}

export default ChangeAddress
