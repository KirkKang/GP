import React, { useEffect, useState } from 'react'
import axios from '../../src/axios'
import { useLocation, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [codeError, setCodeError] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

   useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email)
    }
   }, [location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setCodeError(false)

    try {
      const res = await axios.post('/api/reset-password', {
        email,
        code,
        newPassword,
      },{ withCredentials: true })
      if (res.data.Status === '密碼已重設成功') {
        setMessage('密碼已成功重設，請重新登入')
        // 2秒後自動跳轉登入頁
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } else {
        setError(res.data.Error || '重設密碼失敗')
        if (res.data.Error === '驗證碼錯誤') {
          setCodeError(true)
        }
      }
    } catch (err) {
      if (err.response?.data?.Error) {
        setError(err.response.data.Error)
        if (err.response.data.Error === '驗證碼錯誤') {
          setCodeError(true)
        }
      } else {
        setError('伺服器錯誤，請稍後再試')
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">重設密碼</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">信箱</label>
        <input
          type="email"
          required
          readOnly
          className="w-full p-2 mb-4 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2 font-semibold">驗證碼</label>
        <input
          type="text"
          required
          className="w-full p-2 mb-4 border rounded"
          placeholder="輸入驗證碼"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <label className="block mb-2 font-semibold">新密碼</label>
        <input
          type="password"
          required
          className="w-full p-2 mb-4 border rounded"
          placeholder="輸入新密碼"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          送出
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  )
}

export default ResetPassword
