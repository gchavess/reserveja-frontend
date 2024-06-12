import axios from "axios";

const API_URL = "http://localhost:3000";

const UserReserveTableRoomService = {
  createUserReserveTableRoomService: async (UserReserveTableRoomData) => {
    const response = await axios.post(
      `${API_URL}/userReserveTableRoom`,
      UserReserveTableRoomData
    );
    return response.data;
  },
};

export default UserReserveTableRoomService;
