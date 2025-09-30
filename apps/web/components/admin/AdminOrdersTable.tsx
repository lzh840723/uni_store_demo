'use client';

import { useQuery } from '@tanstack/react-query';
import { adminFetchOrders } from '../../lib/api/admin';
import { formatCurrency } from '../../lib/format';

export function AdminOrdersTable() {
  const { data: orders } = useQuery({ queryKey: ['admin', 'orders'], queryFn: adminFetchOrders });

  return (
    <div className="surface">
      <h1 style={{ marginTop: 0 }}>订单列表</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(15,23,42,0.1)' }}>
            <th>订单号</th>
            <th>金额</th>
            <th>状态</th>
            <th>创建时间</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order.id} style={{ borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
              <td>{order.displayId ?? order.id}</td>
              <td>{formatCurrency(order.totalCents, order.currency)}</td>
              <td>{order.status}</td>
              <td>{new Date(order.createdAt).toLocaleString('zh-CN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
