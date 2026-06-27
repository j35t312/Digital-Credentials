import styles from './CrestImage.module.css';

interface CrestImageProps {
  thumbnail: string | null;
}

// Inline SVG placeholder used when the pass contains no thumbnail.png.
const PLACEHOLDER_CREST =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70" role="img" aria-label="No image">
      <rect width="70" height="70" fill="#e0e0e0"/>
      <path d="M14 50l13-16 9 11 6-7 14 12z" fill="#b0b0b0"/>
      <circle cx="24" cy="22" r="7" fill="#b0b0b0"/>
    </svg>`,
  );

export function CrestImage({ thumbnail }: CrestImageProps) {
  const src = thumbnail || PLACEHOLDER_CREST;
  const alt = thumbnail ? 'Pass thumbnail' : 'No image available';

  return (
    <div className={styles.crestContainer}>
      <img src={src} className={styles.crest} alt={alt} />
    </div>
  );
}
