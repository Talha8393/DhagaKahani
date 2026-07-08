import { useLocation, Outlet } from 'react-router-dom';

export function AnimatedOutlet() {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="animate-page-enter motion-reduce:animate-none"
    >
      <Outlet />
    </div>
  );
}
