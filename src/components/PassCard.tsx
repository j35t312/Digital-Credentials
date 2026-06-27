import { useState } from 'react';
import type { PassViewModel } from '../lib/passModel';
import { Barcode } from './Barcode';
import { CrestImage } from './CrestImage';
import { PassDetailView } from './PassDetailView';
import styles from './PassCard.module.css';

interface PassCardProps {
  model: PassViewModel;
  thumbnail: string | null;
}

export function PassCard({ model, thumbnail }: PassCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { colors } = model;
  const labelStyle = { color: colors.labelColor };

  return (
    <div
      className={styles.pkpassCard}
      style={{ backgroundColor: colors.bg, color: colors.fg }}
    >
      <div className={styles.topRow}>
        <div className={styles.brandContainer}>
          <span className={styles.logoText}>{model.logoText}</span>
          <span className={styles.subLogoText} style={labelStyle}>
            {model.address}
          </span>
        </div>

        <CrestImage thumbnail={thumbnail} />
      </div>

      <div className={styles.topMidRow}>
        <span className={styles.subLogoText} style={labelStyle}>
          {model.broker}
        </span>
      </div>

      <div className={styles.pinkCardLayout}>
        <div className={styles.policySection}>
          <span className={styles.fieldLabel} style={labelStyle}>
            {model.policyNum.label}
          </span>
          <div className={styles.policyLargeValue}>{model.policyNum.value}</div>
        </div>

        <div className={styles.splitRow}>
          <div className={styles.splitCol}>
            <span className={styles.fieldLabel} style={labelStyle}>
              {model.effDate.label}
            </span>
            <span className={styles.fieldValue}>{model.effDate.value}</span>
          </div>
          <div className={`${styles.splitCol} ${styles.rightAlign}`}>
            <span className={styles.fieldLabel} style={labelStyle}>
              {model.expiry.label}
            </span>
            <span className={styles.fieldValue}>{model.expiry.value}</span>
          </div>
        </div>

        <div className={styles.splitRow}>
          <div className={styles.splitCol}>
            <span className={styles.fieldLabel} style={labelStyle}>
              {model.vehicle.label}
            </span>
            <span className={styles.fieldValue}>{model.vehicle.value}</span>
          </div>
          <div className={`${styles.splitCol} ${styles.rightAlign}`}>
            <span className={styles.fieldLabel} style={labelStyle}>
              {model.vin.label}
            </span>
            <span className={styles.fieldValue}>{model.vin.value}</span>
          </div>
        </div>

        <div>
          <div className={styles.fieldLabel} style={labelStyle}>
            NAME OF INSURED
          </div>
          <div className={styles.fieldValue}>{model.customer}</div>
        </div>
      </div>

      <div className={styles.legalFooter} style={labelStyle}>
        Motor Vehicle Liability Insurance Card Canada Inter-Province Applicable
        Within Canada and United States of America.
      </div>

      <div
        className={styles.infoIcon}
        style={{ color: colors.fg }}
        role="button"
        tabIndex={0}
        aria-label="View insurance details"
        title="View details"
        onClick={() => setDetailsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setDetailsOpen(true);
          }
        }}
      >
        i
      </div>

      {model.barcode && <Barcode barcode={model.barcode} />}

      {detailsOpen && (
        <PassDetailView
          title={model.logoText}
          rows={model.detailRows}
          colors={colors}
          onClose={() => setDetailsOpen(false)}
        />
      )}
    </div>
  );
}
