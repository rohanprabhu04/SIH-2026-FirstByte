import { apiGet } from "./api-client";

export function getInternships() {
  return apiGet<unknown>("/internships");
}