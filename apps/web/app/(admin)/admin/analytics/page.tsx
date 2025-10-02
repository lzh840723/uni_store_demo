import dynamic from 'next/dynamic';

const AdminAnalytics = dynamic(() => import('../../../../components/admin/AdminAnalytics'), {
  ssr: false
});

export default function AnalyticsPage() {
  return <AdminAnalytics />;
}
