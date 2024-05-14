/* eslint-disable */

import axios from "axios";

const API_URL = "http://localhost:3000";

const AuthService = {
  login: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      return { data: response.data, status: response.status };
    } catch (error) {
      throw error;
    }
  },
};

export default AuthService;
