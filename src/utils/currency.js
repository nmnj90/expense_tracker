export const CURRENCIES = [
  { value: 'RSD', label: 'RSD', symbol: 'RSD' },
  { value: 'EUR', label: 'EUR', symbol: '€' },
  { value: 'USD', label: 'USD', symbol: '$' },
];

export function formatMoney(amount, currency = 'RSD', { signed = false } = {}) {
  try {
    return new Intl.NumberFormat('sr-RS', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
      signDisplay: signed ? 'exceptZero' : 'auto',
    }).format(Number(amount) || 0);
  } catch {
    const value = Number(amount) || 0;
    return `${value} ${currency}`;
  }
}
