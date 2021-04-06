import http from "./httpService";
import auth from "../services/authService";

const apiEndpoint = "dealers";

const config = { headers: { "x-auth-token": auth.getJwt() } };

const getDealer = async (dealerId) => {
  return await http.get(apiEndpoint + "/" + dealerId, config);
};

const getDealers = async () => {
  return await http.get(apiEndpoint, config);
};

const createDealer = async (dealer) => {
  return await http.post(apiEndpoint, dealer, config);
};

const updateDealer = async (dealerId, dealer) => {
  return await http.put(apiEndpoint + "/" + dealerId, dealer, config);
};

const updateStatusDealer = async (dealerId, dealer) => {
  return await http.put(
    apiEndpoint + "/updatestatus/" + dealerId,
    dealer,
    config
  );
};

const deleteDealer = async (dealerId) => {
  return await http.delete(apiEndpoint + "/" + dealerId, config);
};

const dealerService = {
  getDealer,
  getDealers,
  createDealer,
  updateDealer,
  updateStatusDealer,
  deleteDealer,
};

export default dealerService;
