'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { DollarSign, IndianRupee, Check, ChevronDown } from 'lucide-react';

export default function CurrencySwitcher() {
  const { currentTheme, currency, setCurrency } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 border"
        style={{ 
          backgroundColor: currentTheme.colors.surface,
          border: `1px solid ${currentTheme.colors.border}`,
          color: currentTheme.colors.textSecondary
        }}
        title="Change Currency"
      >
        {currency === 'USD' ? (
          <DollarSign className="w-4 h-4" />
        ) : (
          <IndianRupee className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">{currency}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
      </button>

      {showMenu && (
        <div 
          className="absolute right-0 mt-2 w-32 rounded-lg shadow-lg border z-50 overflow-hidden"
          style={{ 
            backgroundColor: currentTheme.colors.surface,
            borderColor: currentTheme.colors.border
          }}
        >
          {['USD', 'INR'].map((curr) => (
            <button
              key={curr}
              onClick={() => {
                setCurrency(curr as 'USD' | 'INR');
                setShowMenu(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 transition-colors duration-150 hover:bg-opacity-80"
              style={{ 
                backgroundColor: currency === curr ? currentTheme.colors.surfaceHover : 'transparent',
                color: currency === curr ? currentTheme.colors.primary : currentTheme.colors.textSecondary
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
  );
}
