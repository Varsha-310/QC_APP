import axios from "axios";

const instance = axios.create({
  baseURL: "https://0f9a-106-51-87-194.ngrok-free.app",
  timeout: 8000,
});

instance.defaults.headers.common["Content-Type"] = "application/json";

export default instance;
