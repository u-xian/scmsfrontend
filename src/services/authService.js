import http from "./httpService";
import jwtDecode from "jwt-decode";

const apiEndpoint = "auth";
const tokenKey = "token";

const login = async (username, password) => {
  const jwt = await http.post(apiEndpoint, { username, password });
  if (jwt.data.status === 1) {
    localStorage.setItem(tokenKey, jwt.data.statusMessage);
    return jwt.data;
  } else {
    return jwt.data;
  }
};

const resetPassword = async (userId, user) => {
  const { data: response } = await http.put(apiEndpoint + "/" + userId, user);
  return response;
};

const logout = () => {
  localStorage.removeItem(tokenKey);
};

const getCurrentUser = () => {
  try {
    return jwtDecode(localStorage.getItem(tokenKey));
  } catch (ex) {
    return null;
  }
};

const getJwt = () => {
  return localStorage.getItem(tokenKey);
};

const authService = {
  login,
  logout,
  getCurrentUser,
  getJwt,
  resetPassword,
};
export default authService;
