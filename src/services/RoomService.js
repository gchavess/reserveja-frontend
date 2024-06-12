import axios from "axios";

const API_URL = "http://localhost:3000";

const RoomService = {
  getRooms: async (userId) => {
    const response = await axios.get(`${API_URL}/userRoom/user/${userId}`);
    return response.data;
  },
  createRoom: async (roomData) => {
    const response = await axios.post(`${API_URL}/rooms`, roomData);
    return response.data;
  },
  createUserRoom: async (userRoom) => {
    const response = await axios.post(`${API_URL}/userRoom`, userRoom);
    return response.data;
  },
  deleteRoom: async (id) => {
    const response = await axios.delete(`${API_URL}/rooms/${id}`);
    return response.data;
  },
};

export default RoomService;
