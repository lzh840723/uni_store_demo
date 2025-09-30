import Link from 'next/link';
import { fetchFeatureFlags } from '../lib/flags.server';

const cards = [
  {
    href: '/store',
    title: 'Storefront',
    description: '商品浏览、加入购物车并完成模拟结账。',
    feature: 'commerce'
  },
  {
    href: '/admin',
    title: 'Admin',
    description: '管理商品 / 订单 / 用户，并查看 7 日 GMV。',
    feature: 'commerce'
  },
  {
    href: '/cms',
    title: 'CMS',
    description: '浏览文章内容，体验内置 CMS。',
    feature: 'cms'
  }
] as const;

export default async function HomePage() {
  const flags = await fetchFeatureFlags();

  return (
    <section className="surface" style={{ marginTop: '2rem' }}>
      <h1 style={{ marginTop: 0 }}>UniStore 多入口演示</h1>
      <p style={{ maxWidth: '640px', color: 'rgba(15, 23, 42, 0.7)' }}>
        通过顶部的 RoleSwitcher 与 FlagToggle，可以快速切换 Admin / Customer 视角，或关闭模块实现
        feature flag 演示。
      </p>
      <div className="card-grid" style={{ marginTop: '2rem' }}>
        {cards.map((card) => {
          const disabled = !flags[card.feature as keyof typeof flags];
          return (
            <Link
              key={card.href}
              href={disabled ? '#' : card.href}
              className="surface"
              style={{
                opacity: disabled ? 0.4 : 1,
                pointerEvents: disabled ? 'none' : 'auto',
                border: '1px solid rgba(37, 99, 235, 0.1)'
              }}
            >
              <h2 style={{ marginTop: 0 }}>{card.title}</h2>
              <p style={{ fontSize: '0.95rem', color: 'rgba(15, 23, 42, 0.7)' }}>{card.description}</p>
              <span style={{ fontSize: '0.8rem', color: disabled ? '#ef4444' : '#16a34a' }}>
                Flag: {disabled ? 'OFF' : 'ON'}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
