export interface UserBadgeCreateDto {
  userId: string;
  badge: string;
}

export interface UserBadgeResponseDto {
  id: string;
  userId: string;
  badge: string;
  earnedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface BadgeDefinition {
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'points' | 'actions' | 'streak';
    value: number;
    action?: string;
  };
}

export interface UserBadgesDto {
  userId: string;
  badges: UserBadgeResponseDto[];
  availableBadges: BadgeDefinition[];
}