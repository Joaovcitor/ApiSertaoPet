import { ActivityType } from "@prisma/client";

export interface ActivityLogCreateDto {
  userId: string;
  action: ActivityType;
  points: number;
  description?: string;
  metadata?: any;
}

export interface ActivityLogResponseDto {
  id: string;
  userId: string;
  action: ActivityType;
  points: number;
  description?: string | null;
  metadata?: any;
  createdAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UserPointsDto {
  userId: string;
  totalPoints: number;
  recentActivities: ActivityLogResponseDto[];
}

export interface LeaderboardDto {
  userId: string;
  userName: string;
  totalPoints: number;
  rank: number;
}
