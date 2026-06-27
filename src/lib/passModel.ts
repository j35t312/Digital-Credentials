import type {
  PassBarcode,
  PassData,
  PassField,
  PassStructure,
  PassStyleKey,
} from '../types/pass';

export interface DetailRow {
  label: string;
  value: string;
}

export interface PassViewModel {
  colors: {
    bg: string;
    fg: string;
    labelColor: string;
  };
  logoText: string;
  address: string;
  broker: string;
  policyNum: { label: string; value: string };
  effDate: { label: string; value: string };
  vehicle: { label: string; value: string };
  vin: { label: string; value: string };
  expiry: { label: string; value: string };
  customer: string;
  barcode: PassBarcode | null;
  detailRows: DetailRow[];
}

const PASS_TYPES: PassStyleKey[] = [
  'generic',
  'storeCard',
  'coupon',
  'eventTicket',
  'boardingPass',
];

const EMPTY = '—';

/**
 * Pure transform from raw pass.json into the normalized view model the React
 * card components render. Mirrors the field-extraction logic from the original
 * renderPassCard implementation.
 */
export function buildPassViewModel(data: PassData): PassViewModel {
  const typeKey = PASS_TYPES.find((key) => data[key] !== undefined) ?? 'generic';
  const structure: PassStructure = data[typeKey] ?? {};

  const bg = data.backgroundColor || '#FFC9CE';
  const fg = data.foregroundColor || '#1c1c1e';
  const labelColor = data.labelColor || '#545456';

  const fields: PassField[] = [
    ...(structure.headerFields ?? []),
    ...(structure.primaryFields ?? []),
    ...(structure.secondaryFields ?? []),
    ...(structure.auxiliaryFields ?? []),
    ...(structure.backFields ?? []),
  ];

  const getRawValue = (key: string): string => {
    const f = fields.find((field) => field.key === key);
    return f ? f.value : '';
  };

  const insuranceFull = getRawValue('insuranceCompany');
  const brokerFull = getRawValue('brokerageCompany');
  const customerFull = getRawValue('customerInfo');

  // Insurer address: lines 2-4 of the insuranceCompany value.
  let address = '';
  for (const field of fields) {
    if (field.key === 'insuranceCompany') {
      address = field.value.split('\n').slice(1, 4).join();
    }
  }

  // Broker info.
  let broker = '';
  for (const field of fields) {
    if (field.key === 'brokerageCompany') {
      broker = field.value.split('\n').slice(0).join();
    }
  }
  broker = `Agent: ${broker}`;
  broker = broker.slice(0, broker.trim().length - 1);

  // Customer info.
  let customer = '';
  for (const field of fields) {
    if (field.key === 'customerInfo') {
      customer = field.value;
    }
  }

  const findField = (keys: string[]): PassField =>
    fields.find((f) => keys.some((k) => f.key.toLowerCase().includes(k))) ?? {
      key: '',
      label: '',
      value: EMPTY,
    };

  const policyNum = findField(['policy', 'number', 'id']);
  const effDate = findField(['effective', 'start', 'eff']);
  const vehicle = findField(['vehicle', 'car', 'description']);
  const vin = findField(['vin', 'serial', 'chassis']);

  const expField = findField([
    'expiry',
    'expires',
    'end',
    'expiration',
    'valid_until',
    'termination',
  ]);
  let expValue = expField.value;
  if (expValue === EMPTY && data.expirationDate) {
    expValue = data.expirationDate.split('T')[0];
  }

  // Prefer dedicated back fields when present (they hold complete values).
  const vehicleBackField = (structure.backFields ?? []).find((f) =>
    (f.label ?? '').toLowerCase().includes('vehicle'),
  );
  const vehicleInfo = vehicleBackField
    ? vehicleBackField.value
    : [vehicle.value, vin.value !== EMPTY ? `Serial No: ${vin.value}` : '']
        .filter((v) => v && v !== EMPTY)
        .join('\n');

  const policyBackField = (structure.backFields ?? []).find((f) =>
    (f.label ?? '').toLowerCase().includes('policy'),
  );
  const policyInfo = policyBackField
    ? policyBackField.value
    : [
        policyNum.value !== EMPTY ? `Policy No: ${policyNum.value}` : '',
        effDate.value !== EMPTY ? `Effective: ${effDate.value}` : '',
        expValue !== EMPTY ? `Expiry: ${expValue}` : '',
      ]
        .filter(Boolean)
        .join('\n');

  const knownKeys = new Set(
    [
      'insuranceCompany',
      'brokerageCompany',
      'customerInfo',
      policyNum.key,
      effDate.key,
      vehicle.key,
      vin.key,
      expField.key,
      vehicleBackField?.key,
      policyBackField?.key,
    ].filter(Boolean) as string[],
  );

  const extraBackFields = (structure.backFields ?? []).filter(
    (f) => !knownKeys.has(f.key),
  );

  const normalizeRow = (value: string): string =>
    value === undefined || value === null || value === '' || value === EMPTY
      ? EMPTY
      : value;

  const detailRows: DetailRow[] = [
    { label: 'Name and Address of Insured', value: normalizeRow(customerFull || customer) },
    { label: 'Vehicle Information', value: normalizeRow(vehicleInfo) },
    { label: 'Policy Information', value: normalizeRow(policyInfo) },
    { label: 'Insurance Company', value: normalizeRow(insuranceFull) },
    { label: 'Brokerage', value: normalizeRow(brokerFull) },
    ...extraBackFields.map((f) => ({
      label: f.label || f.key || 'Info',
      value: normalizeRow(f.value),
    })),
  ];

  const barcode = data.barcodes?.[0] ?? data.barcode ?? null;

  return {
    colors: { bg, fg, labelColor },
    logoText: data.logoText ?? '',
    address,
    broker,
    policyNum: { label: policyNum.label || 'POLICY NUMBER', value: policyNum.value },
    effDate: { label: effDate.label || 'EFFECTIVE DATE', value: effDate.value },
    vehicle: { label: vehicle.label || 'INSURED VEHICLE', value: vehicle.value },
    vin: { label: vin.label || 'SERIAL NO', value: vin.value },
    expiry: { label: expField.label || 'EXPIRY DATE', value: expValue },
    customer,
    barcode,
    detailRows,
  };
}
