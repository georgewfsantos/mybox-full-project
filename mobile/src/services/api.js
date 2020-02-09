import axios from "axios";

const api = axios.create({
  baseURL: "https://mybox-omnistack.herokuapp.com"
});

export default api;
