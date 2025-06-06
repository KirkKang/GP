import axios from "../../src/axios"
import React, { useState } from 'react'
const Register = ({openLogin}) => {
    const [values, setValues] = useState({
        name:'',
        email:'',
        password:'',
    })

    const handleSubmit = (e) => {
  e.preventDefault();
  axios.post('api/register', values)
    .then(res => {
      console.log("成功", res);
      alert("註冊成功");
      onClick={openLogin};
    })
    .catch(err => {
      console.log("fail", err);
      // 從錯誤響應中取出訊息
      if (err.response && err.response.data && err.response.data.Error) {
        alert("錯誤原因: " + err.response.data.Error);
      } else {
        alert("註冊失敗，請稍後再試");
      }
    });
}

    

  return (
    <div>
        <h2 className='text-2xl font-bold mb-4'>註冊</h2>
        <form onSubmit={handleSubmit}>
            <div className='mb-4'>
                <label className='block text-gray-700'>姓名</label>
                <input type='text' className='w-full px-3 py-2 border' placeholder='輸入姓名' name='name'
                    onChange={e => setValues({...values,name: e.target.value})}
                />
            </div>

            <div className='mb-4'>
                <label className='block text-gray-700'>信箱</label>
                <input type='email' className='w-full px-3 py-2 border' placeholder='輸入信箱' name='email'
                    onChange={e => setValues({...values,email: e.target.value})}
                />
            </div>

            <div className='mb-4'>
                <label className='block text-gray-700'>密碼</label>
                <input type='password' className='w-full px-3 py-2 border' placeholder='輸入密碼' name='password'
                    onChange={e => setValues({...values,password: e.target.value})}
                />
            </div>
            <div className='mb-4'>
                <button type='submit' className='w-full bg-red-600 text-white py-2'>註冊</button>
            </div>
        </form>
        <div className='text-center'>
            <span className='text-gray-700'>已經擁有帳號了嗎?</span>
            <button className='text-red-800' onClick={openLogin}>登入</button>
        </div>
    </div>
  )
}

export default Register
