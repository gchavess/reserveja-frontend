import axios from "axios";

const API_URL = "http://localhost:3000";

const tableRoom = {
  getTableRoom: async () => {
    const response = await axios.get(`${API_URL}/tableRoom`);
    return response.data;
  },
  createTableRoom: async (tableRoomata) => {
    const response = await axios.post(`${API_URL}/tableRoom`, tableRoomata);
    return response.data;
  },
  deleteTableRoom: async (id) => {
    const response = await axios.delete(`${API_URL}/tableRoom/${id}`);
    return response.data;
  },
};

export default tableRoom;
