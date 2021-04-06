import http from "./httpService";
import auth from "../services/authService";

const apiEndpoint = "user";

const config = { headers: { "x-auth-token": auth.getJwt() } };

const getUser = async (userId) => {
  return await http.get(apiEndpoint + "/" + userId, config);
};

const getUsers = async () => {
  return await http.get(apiEndpoint, config);
};

const createUser = async (user) => {
  return await http.post(apiEndpoint, user);
};

const updateUser = async (userId, user) => {
  return await http.put(apiEndpoint + "/" + userId, user, config);
};

const updateStatusUser = async (userId, user) => {
  return await http.put(apiEndpoint + "/updatestatus/" + userId, user, config);
};

const deleteUser = async (userId) => {
  return await http.delete(apiEndpoint + "/" + userId, config);
};

const userService = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateStatusUser,
  deleteUser,
};

export default userService;
