'use client';

import { useQuery } from '@tanstack/react-query';
import { adminFetchAnalytics } from '../../lib/api/admin';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export function AdminAnalytics() {
  const { data } = useQuery({ queryKey: ['admin', 'analytics'], queryFn: adminFetchAnalytics });

  const chartData = data?.labels.map((label, index) => ({
    label,
    count: data.data.count[index],
    gmv: Math.round(data.data.gmv[index] / 100)
  }));

  return (
    <div className="surface">
      <h1 style={{ marginTop: 0 }}>近 7 日订单与 GMV</h1>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip formatter={(value, name) => (name === 'gmv' ? `$${value}` : value)} />
            <Legend />
            <Line type="monotone" dataKey="count" name="订单数" stroke="#2563eb" yAxisId="left" />
            <Line type="monotone" dataKey="gmv" name="GMV ($)" stroke="#16a34a" yAxisId="right" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'rgba(15,23,42,0.6)' }}>
        GMV 以美元显示，已经按 100 分换算。实际金额参考后台数据。
      </p>
    </div>
  );
}
