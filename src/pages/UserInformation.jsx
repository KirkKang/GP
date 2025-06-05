import React, { useState, useEffect } from 'react';
import axios from "../../src/axios"

const UserInformation = () => {
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
    axios.post('http://localhost:3001/api/updateuserinfo', userData, { withCredentials: true })
      .then(() => alert('已更新用戶資料！'))
      .catch(() => alert('更新失敗，請稍後再試'));
  };

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

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          更新資料
        </button>
      </form>
    </div>
  );
};

export default UserInformation;
