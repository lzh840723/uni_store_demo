import Link from 'next/link';

const cards = [
  {
    href: '/admin/products',
    title: '商品管理',
    description: '新增 / 编辑 / 删除商品，并同步到前台。'
  },
  {
    href: '/admin/orders',
    title: '订单中心',
    description: '查看 7 日内订单与支付状态。'
  },
  {
    href: '/admin/users',
    title: '用户角色',
    description: '切换演示用户的角色信息。'
  },
  {
    href: '/admin/analytics',
    title: 'Analytics',
    description: '查看 7 日订单数与 GMV 趋势图。'
  },
  {
    href: '/admin/cms',
    title: 'CMS 管理',
    description: '维护文章内容或跳转 Keystone。'
  }
];

export default function AdminHomePage() {
  return (
    <section className="card-grid">
      {cards.map((card) => (
        <Link key={card.href} href={card.href} className="surface">
          <h2 style={{ marginTop: 0 }}>{card.title}</h2>
          <p style={{ color: 'rgba(15,23,42,0.7)', fontSize: '0.95rem' }}>{card.description}</p>
        </Link>
      ))}
    </section>
  );
}
