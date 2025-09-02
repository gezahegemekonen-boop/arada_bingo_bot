import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const api = axios.create({
  baseURL: process.env.BACKEND_URL,
  headers: {
    'x-admin-token': process.env.ADMIN_SECRET
  }
});

export default api;

