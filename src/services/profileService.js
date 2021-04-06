import http from "./httpService";
import auth from "../services/authService";

const apiEndpoint = "profiles";

const config = { headers: { "x-auth-token": auth.getJwt() } };

const getProfile = async (profileId) => {
  return await http.get(apiEndpoint + "/" + profileId, config);
};

const getProfiles = async () => {
  return await http.get(apiEndpoint, config);
};

const createProfile = async (profile) => {
  return await http.post(apiEndpoint, profile, config);
};

const updateProfile = async (profileId, profile) => {
  return await http.put(apiEndpoint + "/" + profileId, profile, config);
};

const updateStatusProfile = async (profileId, profile) => {
  return await http.put(
    apiEndpoint + "/updatestatus/" + profileId,
    profile,
    config
  );
};

const deleteProfile = async (profileId) => {
  return await http.delete(apiEndpoint + "/" + profileId, config);
};

const ProfileService = {
  getProfile,
  getProfiles,
  createProfile,
  updateProfile,
  updateStatusProfile,
  deleteProfile,
};

export default ProfileService;
