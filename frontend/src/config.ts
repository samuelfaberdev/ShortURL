export const API_URL =
  typeof window !== "undefined" && location.origin.includes("localhost:3000")
    ? "http://localhost:5050/api"
    : "/api";

export const FRONT_URL = typeof window !== "undefined" ? location.origin : "";
