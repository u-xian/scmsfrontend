import http from "./httpService";
import auth from "../services/authService";

const apiEndpoint = "accessmenu";
const ProfileApiEndpoint = "profiles";

const config = { headers: { "x-auth-token": auth.getJwt() } };

const getMenu = async (profileId) => {
  return await http.get(apiEndpoint + "/listmenu/" + profileId, config);
};

const getDefaultMenu = async (profileId) => {
  return await http.get(apiEndpoint + "/listdefaultmenu/" + profileId, config);
};

const getMenuById = async (menuId) => {
  return await http.get(apiEndpoint + "/" + menuId, config);
};

const getAllMenus = async () => {
  const { data: menus } = await http.get(apiEndpoint, config);
  const { data: profiles } = await http.get(ProfileApiEndpoint, config);

  return menus.data.map((t1) => ({
    ...t1,
    profileLevels: [
      ...t1.accesslevel.map((s1) => ({
        ...profiles.data.find((t2) => t2.id === s1),
      })),
    ],
  }));
};

const createMenu = async (menu) => {
  return await http.post(apiEndpoint, menu, config);
};

const updateMenu = async (menuId, menu) => {
  return await http.put(apiEndpoint + "/" + menuId, menu, config);
};

const updateStatusMenu = async (menuId, menu) => {
  return await http.put(apiEndpoint + "/updatestatus/" + menuId, menu, config);
};

const deleteMenu = async (menuId) => {
  return await http.delete(apiEndpoint + "/" + menuId, config);
};

const menuService = {
  getMenu,
  getDefaultMenu,
  getMenuById,
  getAllMenus,
  createMenu,
  updateMenu,
  updateStatusMenu,
  deleteMenu,
};

export default menuService;
