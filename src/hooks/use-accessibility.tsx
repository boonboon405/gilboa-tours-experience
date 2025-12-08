import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
  stopAnimations: boolean;
  readableFont: boolean;
  largeCursor: boolean;
  readingGuide: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetSettings: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  stopAnimations: false,
  readableFont: false,
  largeCursor: false,
  readingGuide: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = 'accessibility-settings';

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) };
        } catch {
          return defaultSettings;
        }
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyAccessibilityStyles(settings);
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const increaseFontSize = () => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.min(prev.fontSize + 10, 150),
    }));
  };

  const decreaseFontSize = () => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(prev.fontSize - 10, 80),
    }));
  };

  return (
    <AccessibilityContext.Provider
      value={{ settings, updateSetting, resetSettings, increaseFontSize, decreaseFontSize }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

function applyAccessibilityStyles(settings: AccessibilitySettings) {
  const root = document.documentElement;
  const body = document.body;

  // Font size
  root.style.fontSize = `${settings.fontSize}%`;

  // High contrast
  if (settings.highContrast) {
    body.classList.add('high-contrast');
  } else {
    body.classList.remove('high-contrast');
  }

  // Grayscale
  if (settings.grayscale) {
    body.classList.add('grayscale-mode');
  } else {
    body.classList.remove('grayscale-mode');
  }

  // Highlight links
  if (settings.highlightLinks) {
    body.classList.add('highlight-links');
  } else {
    body.classList.remove('highlight-links');
  }

  // Stop animations
  if (settings.stopAnimations) {
    body.classList.add('stop-animations');
  } else {
    body.classList.remove('stop-animations');
  }

  // Readable font
  if (settings.readableFont) {
    body.classList.add('readable-font');
  } else {
    body.classList.remove('readable-font');
  }

  // Large cursor
  if (settings.largeCursor) {
    body.classList.add('large-cursor');
  } else {
    body.classList.remove('large-cursor');
  }

  // Reading guide
  if (settings.readingGuide) {
    body.classList.add('reading-guide');
  } else {
    body.classList.remove('reading-guide');
  }
}
