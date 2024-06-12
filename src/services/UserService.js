import axios from "axios";

const API_URL = "http://localhost:3000";

const UserService = {
  createUser: async (userData) => {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  },
  getUsers: async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },
};

export default UserService;
