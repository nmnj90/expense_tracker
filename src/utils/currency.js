export const CURRENCIES = [
  { value: 'RSD', label: 'RSD', symbol: 'RSD' },
  { value: 'EUR', label: 'EUR', symbol: '€' },
  { value: 'USD', label: 'USD', symbol: '$' },
];

export function formatMoney(amount, currency = 'RSD') {
  try {
    return new Intl.NumberFormat('sr-RS', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  } catch {
    return `${Number(amount) || 0} ${currency}`;
  }
}
