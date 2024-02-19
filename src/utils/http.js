import axios from "axios";

const request = axios.create({
  // baseURL: "http://47.95.13.131:8081",
  timeout: 3000,
});


request.interceptors.request.use((confing) => {
  confing.headers.set("Token", `${localStorage.token}`);
  return confing;
})

export default request;
