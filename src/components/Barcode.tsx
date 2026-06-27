import { useEffect, useRef } from 'react';
import * as bwipjs from 'bwip-js/browser';
import type { PassBarcode } from '../types/pass';
import styles from './Barcode.module.css';

interface BarcodeProps {
  barcode: PassBarcode;
}

function resolveBcid(format: string): string {
  switch (format) {
    case 'PKBarcodeFormatPDF417':
      return 'pdf417';
    case 'PKBarcodeFormatAztec':
      return 'aztec';
    case 'PKBarcodeFormatCode128':
      return 'code128';
    default:
      return 'qr';
  }
}

export function Barcode({ barcode }: BarcodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bcid = resolveBcid(barcode.format);
    const matrix = bcid === 'qr' || bcid === 'aztec';

    try {
      bwipjs.toCanvas(canvas, {
        bcid,
        text: barcode.message,
        scale: 3,
        height: matrix ? undefined : 15,
        includetext: false,
      });
    } catch (err) {
      console.error('Failed to render barcode canvas', err);
    }
  }, [barcode]);

  return (
    <div className={styles.barcodeContainer}>
      <canvas ref={canvasRef} className={styles.barcodeCanvas} />
      <span className={styles.barcodeAltText} style={{ color: '#1c1c1e' }}>
        {barcode.altText || ''}
      </span>
    </div>
  );
}
