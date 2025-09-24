// src/api/actionPlanApi.ts
import { apiClient } from './apiClient';
import { ActionPlanResponse } from '../types/actionPlan';

export const getRecommendedProfessionals = (
  responses?: string[]
): Promise<ActionPlanResponse> => {
  return apiClient(`/action-plan/recommendedProfessionals`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
};
