import type { AdoptionStatus } from "@prisma/client";

export interface adoptionInterest {
  petId: string;
}

export interface adoptionProcessDtoCreate {
  petId: string;
  contact: string;
  notes?: string;
  expectedDate?: Date;
}

export interface updateStatusDto {
  status: AdoptionStatus;
  completedAt?: Date;
  rejectedAt?: Date;
}
