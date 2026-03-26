import { HOST } from "@/utils/constance";
import axios from "axios";

const apiClient = axios.create({
  baseURL: HOST,
});

export default apiClient
