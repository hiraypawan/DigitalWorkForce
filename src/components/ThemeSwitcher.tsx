'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme, themes } from '@/contexts/ThemeContext';
import { Palette, DollarSign, IndianRupee, Check, ChevronDown } from 'lucide-react';

export default function ThemeSwitcher() {
  const { currentTheme, setTheme, currency, setCurrency } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const currencyMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target as Node)) {
        setShowCurrencyMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ThemePreview = ({ theme }: { theme: any }) => (
    <div className="flex gap-1">
      <div 
        className="w-3 h-3 rounded-full border border-white/20" 
        style={{ backgroundColor: theme.colors.primary }}
      />
      <div 
        className="w-3 h-3 rounded-full border border-white/20" 
        style={{ backgroundColor: theme.colors.secondary }}
      />
      <div 
        className="w-3 h-3 rounded-full border border-white/20" 
        style={{ backgroundColor: theme.colors.accent }}
      />
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      {/* Currency Switcher */}
      <div className="relative" ref={currencyMenuRef}>
        <button
          onClick={() => {
            setShowCurrencyMenu(!showCurrencyMenu);
            setShowThemeMenu(false);
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md transition-all duration-200 hover:scale-105"
          style={{ 
            backgroundColor: `${currentTheme.colors.surface}80`,
            border: `1px solid ${currentTheme.colors.border}`,
            color: currentTheme.colors.text
          }}
          title="Change Currency"
        >
          {currency === 'USD' ? (
            <DollarSign className="w-4 h-4" />
          ) : (
            <IndianRupee className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">{currency}</span>
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showCurrencyMenu ? 'rotate-180' : ''}`} />
        </button>

        {showCurrencyMenu && (
          <div 
            className="absolute right-0 mt-2 w-32 rounded-xl backdrop-blur-md shadow-2xl border z-50 overflow-hidden"
            style={{ 
              backgroundColor: `${currentTheme.colors.surface}95`,
              borderColor: currentTheme.colors.border
            }}
          >
            {['USD', 'INR'].map((curr) => (
              <button
                key={curr}
                onClick={() => {
                  setCurrency(curr as 'USD' | 'INR');
                  setShowCurrencyMenu(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 transition-colors duration-150 hover:scale-[1.02]"
                style={{ 
                  backgroundColor: currency === curr ? `${currentTheme.colors.primary}20` : 'transparent',
                  color: currency === curr ? currentTheme.colors.primary : currentTheme.colors.text
                }}
              >
                <div className="flex items-center gap-2">
                  {curr === 'USD' ? (
                    <DollarSign className="w-4 h-4" />
                  ) : (
                    <IndianRupee className="w-4 h-4" />
                  )}
                  <span className="font-medium">{curr}</span>
                </div>
                {currency === curr && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Theme Switcher */}
      <div className="relative" ref={themeMenuRef}>
        <button
          onClick={() => {
            setShowThemeMenu(!showThemeMenu);
            setShowCurrencyMenu(false);
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md transition-all duration-200 hover:scale-105"
          style={{ 
            backgroundColor: `${currentTheme.colors.surface}80`,
            border: `1px solid ${currentTheme.colors.border}`,
            color: currentTheme.colors.text
          }}
          title="Change Theme"
        >
          <Palette className="w-4 h-4" />
          <ThemePreview theme={currentTheme} />
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showThemeMenu ? 'rotate-180' : ''}`} />
        </button>

        {showThemeMenu && (
          <div 
            className="absolute right-0 mt-2 w-64 rounded-xl backdrop-blur-md shadow-2xl border z-50 overflow-hidden"
            style={{ 
              backgroundColor: `${currentTheme.colors.surface}95`,
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="p-2">
              <div 
                className="px-3 py-2 text-xs font-semibold tracking-wide uppercase border-b"
                style={{ 
                  color: currentTheme.colors.textMuted,
                  borderColor: currentTheme.colors.border
                }}
              >
                Choose Theme
              </div>
              <div className="mt-2 space-y-1">
                {Object.values(themes).map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setTheme(theme.id);
                      setShowThemeMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150 hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: currentTheme.id === theme.id ? `${currentTheme.colors.primary}20` : 'transparent',
                      color: currentTheme.id === theme.id ? currentTheme.colors.primary : currentTheme.colors.text
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <ThemePreview theme={theme} />
                      <span className="font-medium text-sm">{theme.name}</span>
                    </div>
                    {currentTheme.id === theme.id && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
