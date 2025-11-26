'use client';

import { SidebarProps } from '../../types';

const Sidebar = ({ show }: SidebarProps) => {
  

  if (!show) return null;

  // ... rest of sidebar code ...
  
  return (
    <div className="offcanvas offcanvas-start show leftsidebar" tabIndex={-1}>
      {/* ... sidebar content ... */}
    </div>
  );
};

export default Sidebar;