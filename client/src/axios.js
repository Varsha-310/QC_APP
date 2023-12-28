import axios from "axios";

const instance = axios.create({
  baseURL: "https://backend.qwikcilver.com",
  timeout: 8000,
});

instance.defaults.headers.common["Content-Type"] = "application/json";

export default instance;
