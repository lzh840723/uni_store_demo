'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import type { Role } from '../lib/auth';

type Props = {
  role: Role;
};

const roles: Role[] = ['CUSTOMER', 'ADMIN'];

export function RoleSwitcher({ role }: Props) {
  const [currentRole, setCurrentRole] = useState<Role>(role);

  const switchRole = (next: Role) => {
    setCurrentRole(next);
    Cookies.set('role', next, { expires: 7 });
    // demo-mode: full reload to let middleware/layout pick up the new role
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {roles.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => switchRole(item)}
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '999px',
            border: '1px solid rgba(37, 99, 235, 0.4)',
            background: currentRole === item ? 'var(--color-primary)' : 'transparent',
            color: currentRole === item ? '#fff' : 'var(--color-primary)',
            fontSize: '0.85rem'
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
