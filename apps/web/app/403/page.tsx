export default function ForbiddenPage() {
  return (
    <section className="surface" style={{ marginTop: '2rem', textAlign: 'center' }}>
      <h1>403</h1>
      <p>你没有访问该页面的权限，请使用 RoleSwitcher 切换到 Admin。</p>
    </section>
  );
}
