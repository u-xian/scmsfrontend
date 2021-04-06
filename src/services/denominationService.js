import http from "./httpService";
import auth from "../services/authService";

const apiEndpoint = "denomination";

const config = { headers: { "x-auth-token": auth.getJwt() } };

const getDenomination = async (denominationId) => {
  return await http.get(apiEndpoint + "/" + denominationId, config);
};

const getDenominations = async () => {
  return await http.get(apiEndpoint, config);
};

const createDenomination = async (denomination) => {
  return await http.post(apiEndpoint, denomination, config);
};

const updateDenomination = async (denominationId, denomination) => {
  return await http.put(
    apiEndpoint + "/" + denominationId,
    denomination,
    config
  );
};

const updateStatusDenomination = async (denominationId, denomination) => {
  return await http.put(
    apiEndpoint + "/updatestatus/" + denominationId,
    denomination,
    config
  );
};

const deleteDenomination = async (denominationId) => {
  return await http.delete(apiEndpoint + "/" + denominationId, config);
};

const denominationService = {
  getDenomination,
  getDenominations,
  createDenomination,
  updateDenomination,
  updateStatusDenomination,
  deleteDenomination,
};

export default denominationService;
