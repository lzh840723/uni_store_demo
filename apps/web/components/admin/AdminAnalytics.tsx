'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminFetchAnalytics } from '../../lib/api/admin';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

function AdminAnalyticsComponent() {
  const { data } = useQuery({ queryKey: ['admin', 'analytics'], queryFn: adminFetchAnalytics });

  const chartData = useMemo(
    () =>
      data?.labels.map((label, index) => ({
        label,
        count: data.data.count[index],
        gmv: Math.round(data.data.gmv[index] / 100)
      })) ?? [],
    [data]
  );

  return (
    <div className="surface">
      <h1 style={{ marginTop: 0 }}>Orders & GMV (last 7 days)</h1>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip formatter={(value, name) => (name === 'gmv' ? `$${value}` : value)} />
            <Legend />
            <Line type="monotone" dataKey="count" name="Orders" stroke="#2563eb" yAxisId="left" />
            <Line type="monotone" dataKey="gmv" name="GMV ($)" stroke="#16a34a" yAxisId="right" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'rgba(15,23,42,0.6)' }}>
        GMV values are shown in USD and converted from cents. Cross-check amounts in the admin API when needed.
      </p>
    </div>
  );
}

export default AdminAnalyticsComponent;
