import http from "./httpService";
import auth from "./authService";

const apiEndpoint = "comments";

const config = { headers: { "x-auth-token": auth.getJwt() } };

const getComment = async (commentId) => {
  return await http.get(apiEndpoint + "/" + commentId, config);
};

const getComments = async () => {
  return await http.get(apiEndpoint, config);
};

const createComment = async (comment) => {
  return await http.post(apiEndpoint, comment, config);
};

const updateComment = async (commentId, comment) => {
  return await http.put(apiEndpoint + "/" + commentId, comment, config);
};

const deleteComment = async (commentId) => {
  return await http.delete(apiEndpoint + "/" + commentId, config);
};

const commentService = {
  getComment,
  getComments,
  createComment,
  updateComment,
  deleteComment,
};

export default commentService;
