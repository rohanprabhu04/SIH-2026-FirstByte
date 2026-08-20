import { apiGet } from "./api-client";

export function getAllocationResults(allocationRunId: string) {
  return apiGet<unknown>(
    `/allocation/runs/${allocationRunId}/results`,
  );
}