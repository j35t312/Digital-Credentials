export interface PassField {
  key: string;
  label?: string;
  value: string;
}

export type BarcodeFormat =
  | 'PKBarcodeFormatQR'
  | 'PKBarcodeFormatPDF417'
  | 'PKBarcodeFormatAztec'
  | 'PKBarcodeFormatCode128'
  | string;

export interface PassBarcode {
  format: BarcodeFormat;
  message: string;
  messageEncoding?: string;
  altText?: string;
}

export interface PassStructure {
  headerFields?: PassField[];
  primaryFields?: PassField[];
  secondaryFields?: PassField[];
  auxiliaryFields?: PassField[];
  backFields?: PassField[];
}

export type PassStyleKey =
  | 'generic'
  | 'storeCard'
  | 'coupon'
  | 'eventTicket'
  | 'boardingPass';

export type PassData = {
  formatVersion?: number;
  logoText?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  labelColor?: string;
  expirationDate?: string;
  barcodes?: PassBarcode[];
  barcode?: PassBarcode;
} & Partial<Record<PassStyleKey, PassStructure>>;

export interface PassAssets {
  thumbnail: string | null;
  crest: string | null;
}

export interface ParsedPass {
  passData: PassData;
  assets: PassAssets;
}
