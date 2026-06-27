import { useEffect, useMemo, useState } from 'react';
import { FileUploadZone } from './components/FileUploadZone';
import { PassCard } from './components/PassCard';
import { processPkpass } from './lib/pkpass';
import { buildPassViewModel } from './lib/passModel';
import type { ParsedPass } from './types/pass';

export default function App() {
  const [parsed, setParsed] = useState<ParsedPass | null>(null);

  // Revoke blob object URLs when the pass is replaced or the app unmounts.
  useEffect(() => {
    const assets = parsed?.assets;
    return () => {
      if (assets?.thumbnail) URL.revokeObjectURL(assets.thumbnail);
      if (assets?.crest) URL.revokeObjectURL(assets.crest);
    };
  }, [parsed]);

  const handleFile = async (file: File) => {
    try {
      const result = await processPkpass(file);
      setParsed(result);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      alert('Failed to read pass file structure: ' + message);
    }
  };

  const model = useMemo(
    () => (parsed ? buildPassViewModel(parsed.passData) : null),
    [parsed],
  );

  return (
    <div className="app-container">
      <h2>Digital Credentials Wallet</h2>

      <FileUploadZone onFile={handleFile} />

      {model && parsed && (
        <PassCard model={model} thumbnail={parsed.assets.thumbnail} />
      )}
    </div>
  );
}
