import { useState } from 'react';
import './BurgerMenu.css';

interface BurgerMenuProps {
  isRadarMode: boolean;
  onToggleRadar: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function BurgerMenu({
  isRadarMode,
  onToggleRadar,
  theme,
  onToggleTheme,
}: BurgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="burger-menu">
      <button 
        className={`burger-button ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && (
        <>
          <div className="menu-overlay" onClick={() => setIsOpen(false)} />
          <div className="menu-content">
            <button 
              className="menu-item"
              onClick={() => handleMenuItemClick(onToggleRadar)}
            >
              <span className="menu-icon">{isRadarMode ? '🗺️' : '📡'}</span>
              <span className="menu-label">{isRadarMode ? 'Map View' : 'Radar View'}</span>
            </button>

            <button 
              className="menu-item"
              onClick={() => handleMenuItemClick(onToggleTheme)}
            >
              <span className="menu-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
              <span className="menu-label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
