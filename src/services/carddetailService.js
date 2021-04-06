import http from "./httpService";
import auth from "../services/authService";

const apiEndpoint = "carddetails";

const config = { headers: { "x-auth-token": auth.getJwt() } };

const getCarddetail = async (carddetailId) => {
  return await http.get(apiEndpoint + "/" + carddetailId, config);
};

const getCarddetails = async () => {
  return await http.get(apiEndpoint, config);
};

const createCarddetail = async (carddetail) => {
  return await http.post(apiEndpoint, carddetail, config);
};

const updateCarddetail = async (carddetailId, carddetail) => {
  return await http.put(apiEndpoint + "/" + carddetailId, carddetail, config);
};

const updateStatusCard = async (activationId, carddetail) => {
  return await http.put(
    apiEndpoint + "/updatestatus/" + activationId,
    carddetail,
    config
  );
};

const deleteCarddetail = async (carddetailId) => {
  return await http.delete(apiEndpoint + "/" + carddetailId, config);
};

const deleteCarddetailByActivId = async (activId) => {
  return await http.delete(apiEndpoint + "/deletebyactivId/" + activId, config);
};

const carddetailService = {
  getCarddetail,
  getCarddetails,
  createCarddetail,
  updateCarddetail,
  updateStatusCard,
  deleteCarddetail,
  deleteCarddetailByActivId,
};

export default carddetailService;
