'use client';

import { useQuery } from '@tanstack/react-query';
import { adminFetchOrders } from '../../lib/api/admin';
import { formatCurrency } from '../../lib/format';

export function AdminOrdersTable() {
  const { data: orders } = useQuery({ queryKey: ['admin', 'orders'], queryFn: adminFetchOrders });

  return (
    <div className="surface">
      <h1 style={{ marginTop: 0 }}>Orders</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(15,23,42,0.1)' }}>
            <th>Order #</th>
            <th>Total</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id} style={{ borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
              <td>{order.displayId ?? order.id}</td>
              <td>{formatCurrency(order.totalCents, order.currency)}</td>
              <td>{order.status}</td>
              <td>{new Date(order.createdAt).toLocaleString('en-US')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
