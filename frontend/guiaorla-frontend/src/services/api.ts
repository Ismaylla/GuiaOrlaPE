import axios from "axios";

export const api = axios.create({
  // Forçando o HTTP puro na porta q o terminal listou
  baseURL: "http://localhost:5148",
  headers: {
    "Content-Type": "application/json",
  },
});