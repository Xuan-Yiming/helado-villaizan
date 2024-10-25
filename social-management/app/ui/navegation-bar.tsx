import React from 'react';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
}

const NavigationBar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems: NavItem[] = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <nav className="navigation-bar">
      <ul className="nav-list">
        {navItems.map((item, index) => (
          <li
            key={index}
            className={`nav-item ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleNavClick(index)}
          >
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationBar;