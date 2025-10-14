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
  images?: string[]; // URLs/paths das imagens processadas pelo Multer
}

export interface ReportUpdateDto {
  status?: ReportStatus;
  resolvedAt?: Date;
}

// Interface para os dados que vêm do formulário (antes do processamento)
export interface ReportFormData {
  type: string;
  description: string;
  reporter?: string;
  phone?: string;
  urgency?: string;
  location: string;
  species: string;
  // As imagens vêm separadamente via req.files
}
