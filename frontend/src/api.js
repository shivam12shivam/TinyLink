import axios from "axios";

// Backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000",
});


export function listLinks() {
  return api.get("/api/links");
}

export function createLink(data) {
  return api.post("/api/links", data);
}

export function getLink(code) {
  return api.get(`/api/links/${code}`);
}

export function deleteLink(code) {
  return api.delete(`/api/links/${code}`);
}


export function healthCheck() {
  return api.get("/healthz");
}
