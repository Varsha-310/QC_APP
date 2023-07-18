import axios from "axios";

const instance = axios.create({
  baseURL: "https://uatdashboard.qwikcilver.com",
});

instance.defaults.headers.common["Content-Type"] = "application/json";

export default instance;
