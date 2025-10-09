import type { ReportStatus, ReportType, Species } from "@prisma/client";

import type { UrgencyLevel } from "@prisma/client";

export interface ReportCreateDto {
  type: ReportType;
  description: string;
  reporter?: string;
  phone?: string;
  urgency?: UrgencyLevel;
  location: string;
  species: Species;
}

export interface ReportUpdateDto {
  status?: ReportStatus;
  resolvedAt?: Date;
}
