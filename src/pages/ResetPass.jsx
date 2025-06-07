import React, { useState } from 'react';
import axios from '../../src/axios';
import { useNavigate } from 'react-router-dom';

const ResetPass = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => { 
    e.preventDefault();

    axios.post('/api/reset-pass', formData, { withCredentials: true })
  .then(() => {
    // 密碼成功更新 → 呼叫登出 API
    axios.get('/api/logout', { withCredentials: true })
      .then(() => {
        alert('密碼已成功更新，請重新登入');
        navigate('/'); // 導回登入頁
      })
      .catch(() => {
        alert('密碼已更新，但自動登出失敗，請手動重新登入');
        navigate('/');
      });
  })
  .catch(err => {
  if (err.response?.status === 401) {
    setMessage('原密碼錯誤，請重新輸入');
  } else {
    setMessage('密碼更新失敗，請稍後再試');
  }
});

  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md mt-10 rounded">
      <h2 className="text-xl font-semibold mb-6">更改密碼</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">原本密碼</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="請輸入原密碼"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">新密碼</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="請輸入新密碼"
            required
          />
        </div>

        {message && <p className="text-red-500 mb-4">{message}</p>}

        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          確認更改
        </button>
      </form>
    </div>
  );
};

export default ResetPass;
