import http from "./httpService";
import auth from "../services/authService";

const apiEndpoint = "activations";

const config = { headers: { "x-auth-token": auth.getJwt() } };

const getActivation = async (activationId) => {
  return await http.get(apiEndpoint + "/" + activationId, config);
};

const getActivations = async (profileId) => {
  return await http.get(apiEndpoint + "/activbyprofile/" + profileId, config);
};

const createActivation = async (activation) => {
  return await http.post(apiEndpoint, activation, config);
};

const updateActivation = async (activationId, activation) => {
  return await http.put(apiEndpoint + "/" + activationId, activation, config);
};

const updateConfirmActivation = async (activationId, activation) => {
  return await http.put(
    apiEndpoint + "/confirm/" + activationId,
    activation,
    config
  );
};

const updateStatusActivation = async (activationId, activation) => {
  return await http.put(
    apiEndpoint + "/updatestatus/" + activationId,
    activation,
    config
  );
};

const deleteActivation = async (activationId) => {
  return await http.delete(apiEndpoint + "/" + activationId, config);
};

const activationService = {
  getActivation,
  getActivations,
  createActivation,
  updateActivation,
  updateConfirmActivation,
  updateStatusActivation,
  deleteActivation,
};

export default activationService;
