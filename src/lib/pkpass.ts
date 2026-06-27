import JSZip from 'jszip';
import type { ParsedPass, PassData } from '../types/pass';

/**
 * Extracts an image from the pkpass archive as an object URL, honoring Apple
 * Wallet's retina naming convention (@2x / @3x fallbacks). Returns null when
 * no matching asset exists.
 */
export async function extractImageBlob(
  zip: JSZip,
  fileName: string,
): Promise<string | null> {
  const file =
    zip.file(fileName) ||
    zip.file(fileName.replace('.png', '@2x.png')) ||
    zip.file(fileName.replace('.png', '@3x.png'));

  if (file) {
    const blob = await file.async('blob');
    return URL.createObjectURL(blob);
  }
  return null;
}

/**
 * Parses a .pkpass file (a ZIP archive) into its pass.json data and the image
 * assets used by the card.
 */
export async function processPkpass(file: File | Blob): Promise<ParsedPass> {
  const zip = await JSZip.loadAsync(file);

  const passJsonFile = zip.file('pass.json');
  if (!passJsonFile) {
    throw new Error('Invalid structure: missing pass.json');
  }

  const passData = JSON.parse(await passJsonFile.async('text')) as PassData;

  const assets = {
    thumbnail: await extractImageBlob(zip, 'thumbnail.png'),
    crest:
      (await extractImageBlob(zip, 'logo.png')) ||
      (await extractImageBlob(zip, 'strip.png')),
  };

  return { passData, assets };
}
