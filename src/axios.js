
import axios from "axios";

const baseURL = import.meta.env.VITE_REACT_APP_API || "http://localhost:3001";

const instance = axios.create({
  baseURL,
  withCredentials: true,
});
console.log("API baseURL:", baseURL);


export default instance;