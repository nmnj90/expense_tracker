function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function expensesKey(accountId) {
  return `expenses:${accountId}`;
}

export function loadExpenses(accountId) {
  const expenses = readJson(expensesKey(accountId), []);
  return Array.isArray(expenses) ? expenses : [];
}

export function saveExpenses(accountId, expenses) {
  localStorage.setItem(expensesKey(accountId), JSON.stringify(expenses));
}
