import styles from './StatBadge.module.css';

interface StatBadgeProps {
  label: string;
  value: string | number;
}

export function StatBadge({ label, value }: StatBadgeProps) {
  return (
    <div className={styles.card}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
