import { AppShell } from '@pizza-avenue/ui';
import { Link, Outlet } from 'react-router-dom';

export function CustomerLayout() {
  return (
    <AppShell
      title="Pizza Avenue — Customer Foundation"
      navigation={
        <>
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/rewards">Rewards</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/cart">Cart</Link>
        </>
      }
    >
      <Outlet />
    </AppShell>
  );
}
