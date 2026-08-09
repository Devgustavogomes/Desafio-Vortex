import styles from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className={styles.pagination} aria-label="Navegação de páginas">
      <button
        className={styles.btn}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
      >
        ← Anterior
      </button>

      <span className={styles.info}>
        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
      </span>

      <button
        className={styles.btn}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Próxima página"
      >
        Próxima →
      </button>
    </nav>
  );
}
