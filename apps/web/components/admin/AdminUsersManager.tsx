'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminFetchUsers, adminUpdateUserRole } from '../../lib/api/admin';

export function AdminUsersManager() {
  const queryClient = useQueryClient();
  const { data: users } = useQuery({ queryKey: ['admin', 'users'], queryFn: adminFetchUsers });

  const updateMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'ADMIN' | 'CUSTOMER' }) => adminUpdateUserRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
  });

  return (
    <div className="surface">
      <h1 style={{ marginTop: 0 }}>用户角色管理</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(15,23,42,0.1)' }}>
            <th>Email</th>
            <th>角色</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => updateMutation.mutate({ id: user.id, role: 'ADMIN' })}
                  style={{ border: 'none', background: 'transparent', color: 'var(--color-primary)' }}
                >
                  设为 Admin
                </button>
                <button
                  type="button"
                  onClick={() => updateMutation.mutate({ id: user.id, role: 'CUSTOMER' })}
                  style={{ border: 'none', background: 'transparent', color: '#ef4444' }}
                >
                  设为 Customer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
