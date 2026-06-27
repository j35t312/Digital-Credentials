import type { DetailRow } from '../lib/passModel';
import styles from './PassDetailView.module.css';

interface PassDetailViewProps {
  title: string;
  rows: DetailRow[];
  colors: { bg: string; fg: string; labelColor: string };
  onClose: () => void;
}

export function PassDetailView({ title, rows, colors, onClose }: PassDetailViewProps) {
  return (
    <div
      className={styles.detailView}
      style={{ backgroundColor: colors.bg, color: colors.fg }}
    >
      <div className={styles.detailHeader} style={{ backgroundColor: colors.bg }}>
        <h3 className={styles.detailTitle}>{title || 'Insurance Details'}</h3>
        <button
          className={styles.detailClose}
          onClick={onClose}
          aria-label="Close details"
        >
          &times;
        </button>
      </div>

      {rows.map((row, index) => (
        <div className={styles.detailRow} key={`${row.label}-${index}`}>
          <div className={styles.detailRowLabel} style={{ color: colors.labelColor }}>
            {row.label}
          </div>
          <div className={styles.detailRowValue}>{row.value}</div>
        </div>
      ))}
    </div>
  );
}
