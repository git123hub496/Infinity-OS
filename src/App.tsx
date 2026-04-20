/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BootScreen } from './components/OS/BootScreen';
import { LoginScreen } from './components/OS/LoginScreen';
import { Desktop } from './components/OS/Desktop';
import { ThemeColor, OSState, THEME_COLORS } from './types';

const AppWrapper = ({ children, brightness }: { children: React.ReactNode; brightness: number }) => (
  <div 
    className="os-brightness w-screen h-screen transition-[filter] duration-300 relative overflow-hidden"
    style={{ filter: `brightness(${brightness}%)` }}
  >
    {children}
  </div>
);

export default function App() {
  const [osState, setOsState] = useState<OSState>(() => {
    const saved = localStorage.getItem('infinity_os_state');
    const base: OSState = {
      isBooted: false,
      isLoggedIn: false,
      accentColor: 'teal' as ThemeColor,
      wallpaper: 'solid-teal',
      installedAppIds: ['terminal', 'settings', 'camera', 'phone', 'browser', 'appstore', 'payment', 'paint', 'files', 'notes', 'email'],
      brightness: 100,
      volume: 60,
      users: [
        { id: 'admin', name: 'SECURITY_ADMIN', role: 'Global Administrator' },
      ],
      currentUserId: 'admin',
      accessibility: {
        highContrast: false,
        reducedMotion: false,
        fontSize: 14,
      },
      notificationSettings: {
        enabled: true,
        soundEnabled: true,
      },
      securitySettings: {
        firewallActive: true,
        encryptionLevel: 'military',
      },
      emails: [
        { 
          id: '1', 
          sender: 'HR_DEPT', 
          subject: 'Security Briefing', 
          body: 'Please review the latest protocols regarding quantum encryption.', 
          timestamp: '2 min ago',
          isRead: false,
          replies: []
        }
      ],
      messages: [
        { id: '1', sender: 'SYST_MONITOR', text: 'All nodes optimized.', timestamp: '10 min ago', isMe: false }
      ],
      notifications: []
    };
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...base, ...parsed, isBooted: false, isLoggedIn: false }; // Always require boot/login
      } catch (e) {
        return base;
      }
    }
    return base;
  });

  useEffect(() => {
    localStorage.setItem('infinity_os_state', JSON.stringify({
      ...osState,
      isBooted: false, // Don't persist session state
      isLoggedIn: false
    }));
  }, [osState]);

  const updateOSConfig = (key: keyof OSState, value: any) => {
    setOsState(prev => ({ ...prev, [key]: value }));
  };

  const theme = THEME_COLORS[osState.accentColor];

  // Global key listener for BIOS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!osState.isLoggedIn && e.key.toLowerCase() === 'b') {
        updateOSConfig('isBooted', false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [osState.isLoggedIn]);

  // Global styles for filters and scrollbars
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        scrollbar-width: thin;
        scrollbar-color: ${theme.primary}20 transparent;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: ${theme.primary}40;
        border-radius: 20px;
      }

      .bg-solid-teal {
        background-color: #002b2b;
        background-image: radial-gradient(circle at center, #004d4d 0%, #001a1a 100%);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [theme.primary]);

  if (!osState.isBooted) {
    return <BootScreen onComplete={() => updateOSConfig('isBooted', true)} />;
  }

  if (!osState.isLoggedIn) {
    return (
      <AppWrapper brightness={osState.brightness}>
        <LoginScreen 
          onLogin={() => updateOSConfig('isLoggedIn', true)} 
          accentColor={theme.primary}
          osState={osState}
          updateOSConfig={updateOSConfig}
        />
      </AppWrapper>
    );
  }

  return (
    <AppWrapper brightness={osState.brightness}>
      <Desktop 
        accentColor={osState.accentColor}
        wallpaper={osState.wallpaper}
        updateOSConfig={updateOSConfig}
        osState={osState}
      />
    </AppWrapper>
  );
}

