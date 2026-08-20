import { apiGet } from "./api-client";

export function getApplicants() {
  return apiGet<unknown>("/applicants");
}

export function getApplicant(applicantId: string) {
  return apiGet<unknown>(`/applicants/${applicantId}`);
}