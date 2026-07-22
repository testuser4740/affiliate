export interface CreateCommissionOverrideInput {
  label?: string;
  appliesTo?: string;
  overridePct?: number;
  originalPct?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface UpdateCommissionOverrideInput {
  label?: string;
  appliesTo?: string;
  overridePct?: number;
  originalPct?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}
