import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost:8800/api",
  withCredentials: true, // IMPORTANT: Allows cookies to be sent/received
});

export default newRequest;