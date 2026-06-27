import { useId, useRef } from 'react';
import styles from './FileUploadZone.module.css';

interface FileUploadZoneProps {
  onFile: (file: File) => void;
}

export function FileUploadZone({ onFile }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFile(file);
    }
    // Reset so selecting the same file again still fires change.
    event.target.value = '';
  };

  return (
    <div className={styles.uploadZone} onClick={() => inputRef.current?.click()}>
      <p>
        Click to open or drag your digital credentials <b>.pkpass</b> file here
      </p>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept=".pkpass"
        onChange={handleChange}
      />
    </div>
  );
}
