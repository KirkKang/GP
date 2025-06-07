import React, { useState } from 'react'
import axios from '../../src/axios'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      const res = await axios.post('/api/forgot-password', { email },{ withCredentials: true })
      if (res.data.Status === '驗證碼已寄出') {
        setMessage('驗證碼已寄出，請至信箱查收')
         setTimeout(() => {
            navigate('/reset-password')
        }, 2000)
      } else {
        setError(res.data.Error || '寄送驗證碼失敗')
      }
    } catch (err) {
      setError('伺服器錯誤，請稍後再試')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">忘記密碼</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">請輸入註冊信箱</label>
        <input
          type="email"
          required
          className="w-full p-2 mb-4 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          發送驗證碼
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  )
}

export default ForgotPassword
