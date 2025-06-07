import React, { useState, useEffect } from 'react';
import axios from "../../src/axios"
import { useNavigate } from 'react-router-dom';

const UserInformation = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    axios.get('api/userinfo', { withCredentials: true })
      .then(res => {
        setUserData(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('api/updateuserinfo', userData, { withCredentials: true })
      .then(() => alert('已更新用戶資料！'))
      .catch(() => alert('更新失敗，請稍後再試'));
  };

  const handleResetPassword = () => {
  navigate('/reset-password', { state: { email: userData.email } });  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md mt-10 rounded">
      <h2 className="text-xl font-semibold mb-6">用戶資料</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">姓名</label>
        <p className="bg-gray-100 px-3 py-2 rounded">{userData.name}</p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Email</label>
        <p className="bg-gray-100 px-3 py-2 rounded">{userData.email}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">地址</label>
          <input
            type="text"
            name="address"
            value={userData.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="輸入地址"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">電話號碼</label>
          <input
            type="text"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="輸入電話號碼"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            更新資料
          </button>
          <button
            type="button"
            onClick={handleResetPassword}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            更改密碼
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInformation;
