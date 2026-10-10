import { Gift, House, List, Receipt, UserCircle } from '@phosphor-icons/react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/menu', label: 'Menu', icon: List },
  { to: '/orders', label: 'Orders', icon: Receipt },
  { to: '/rewards', label: 'Rewards', icon: Gift },
  { to: '/profile', label: 'Profile', icon: UserCircle },
] as const;

export function CustomerDock() {
  return (
    <nav className="bottom-navigation bottom-navigation--floating customer-dock" aria-label="Customer navigation">
      {items.map((item) => {
        const Icon = item.icon;
        return (
        <NavLink
          key={item.to}
          to={item.to}
          {...('end' in item ? { end: item.end } : {})}
          className={({ isActive }) => `bottom-navigation__item${isActive ? ' is-active' : ''}`}
        >
          <Icon aria-hidden="true" className="bottom-navigation__icon" weight="regular" />
          <span>{item.label}</span>
        </NavLink>
        );
      })}
    </nav>
  );
}

// Kept as a compatibility export while routes migrate to the Customer-owned name.
export const BottomNavigation = CustomerDock;
