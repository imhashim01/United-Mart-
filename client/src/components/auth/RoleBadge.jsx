export default function RoleBadge({ role }) {
  const styles = {
    customer: 'bg-orchard-100 text-orchard-800',
    manager: 'bg-mango-100 text-charcoal-900',
    admin: 'bg-charcoal-900 text-white',
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${styles[role] || styles.customer}`}>
      {role}
    </span>
  );
}
