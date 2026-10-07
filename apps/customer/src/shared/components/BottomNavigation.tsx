import { Gift, Home, Menu, ReceiptText, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/menu', label: 'Menu', icon: Menu },
  { to: '/orders', label: 'Orders', icon: ReceiptText },
  { to: '/rewards', label: 'Rewards', icon: Gift },
  { to: '/profile', label: 'Profile', icon: UserRound },
] as const;

export function BottomNavigation() {
  return (
    <nav className="bottom-navigation" aria-label="Customer navigation">
      {items.map((item) => {
        const Icon = item.icon;
        return (
        <NavLink
          key={item.to}
          to={item.to}
          {...('end' in item ? { end: item.end } : {})}
          className={({ isActive }) => `bottom-navigation__item${isActive ? ' is-active' : ''}`}
        >
          <Icon aria-hidden="true" className="bottom-navigation__icon" />
          <span>{item.label}</span>
        </NavLink>
        );
      })}
    </nav>
  );
}
