import React from 'react';

export type ThemeColor = 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'cyan' | 'teal';

export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Email {
  id: string;
  sender: string;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  replies: { role: 'user' | 'model'; text: string; timestamp: string }[];
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
}

export interface OSState {
  isBooted: boolean;
  isLoggedIn: boolean;
  accentColor: ThemeColor;
  wallpaper: string;
  customWallpaper?: string;
  installedAppIds: string[];
  brightness: number;
  volume: number;
  users: User[];
  currentUserId: string;
  fileSystem?: Record<string, any[]>;
  notes?: any[];
  emails?: Email[];
  messages?: Message[];
  notifications?: Notification[];
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: number;
  };
  notificationSettings: {
    enabled: boolean;
    soundEnabled: boolean;
  };
  securitySettings: {
    firewallActive: boolean;
    encryptionLevel: 'standard' | 'quantum' | 'military';
  };
}

export const THEME_COLORS: Record<ThemeColor, { primary: string; secondary: string; glow: string }> = {
  blue: { primary: '#00d4ff', secondary: '#0088cc', glow: 'rgba(0, 212, 255, 0.4)' },
  emerald: { primary: '#00ffaa', secondary: '#00cc88', glow: 'rgba(0, 255, 170, 0.4)' },
  purple: { primary: '#bc00ff', secondary: '#8800cc', glow: 'rgba(188, 0, 255, 0.4)' },
  amber: { primary: '#ffcc00', secondary: '#ccaa00', glow: 'rgba(255, 204, 0, 0.4)' },
  rose: { primary: '#ff0055', secondary: '#cc0044', glow: 'rgba(255, 0, 85, 0.4)' },
  cyan: { primary: '#00f2ff', secondary: '#00cccc', glow: 'rgba(0, 242, 255, 0.4)' },
  teal: { primary: '#00fae1', secondary: '#008080', glow: 'rgba(0, 250, 225, 0.4)' },
};
