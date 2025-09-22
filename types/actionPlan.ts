export interface Professional {
  name: string;
  title: string;
  specialty: string;
  rating: number;
  distance: string;
  availability: string;
  phone: string;
  reason: string;
}

export interface ActionPlanResponse {
  planSteps: string[];
  professionals: Professional[];
}
