import axios from "axios";

const API_URL = "http://localhost:3000";

const RoomService = {
  getRooms: async () => {
    const response = await axios.get(`${API_URL}/rooms`);
    return response.data;
  },
  createRoom: async (roomData) => {
    const response = await axios.post(`${API_URL}/rooms`, roomData);
    return response.data;
  },
  deleteRoom: async (id) => {
    const response = await axios.delete(`${API_URL}/rooms/${id}`);
    return response.data;
  },
};

export default RoomService;
