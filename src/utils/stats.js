import {
  format,
  isSameMonth,
  isSameYear,
  isValid,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns';

export const CATEGORY_COLORS = {
  food: '#c45c4a',
  house: '#2d6a7e',
  transport: '#c48a2a',
  entertainment: '#6b5b95',
  health: '#b24848',
  education: '#3d7ea6',
  other: '#667681',
};

const COST_LABELS = {
  food: 'Food',
  house: 'House',
  transport: 'Transport',
  entertainment: 'Entertainment',
  health: 'Health',
  education: 'Education',
  other: 'Other',
};

function parseDate(value) {
  if (!value) {
    return null;
  }

  const date = parseISO(value);
  return isValid(date) ? date : null;
}

export function getKind(expense) {
  return expense.type?.type === 'income' ? 'income' : 'cost';
}

export function buildStats(expenses, { currency = 'RSD', range = 'all' } = {}) {
  const now = new Date();
  const inRange = expenses.filter((expense) => {
    if ((expense.currency || 'RSD') !== currency) {
      return false;
    }

    if (range !== 'month') {
      return true;
    }

    const date = parseDate(expense.date);
    return date ? isSameMonth(date, now) && isSameYear(date, now) : false;
  });

  const categoryTotals = {};
  let spent = 0;
  let earned = 0;
  let costCount = 0;
  let incomeCount = 0;

  for (const expense of inRange) {
    const amount = Number(expense.amount) || 0;
    const kind = getKind(expense);

    if (kind === 'income') {
      earned += amount;
      incomeCount += 1;
      continue;
    }

    spent += amount;
    costCount += 1;
    const key = expense.typeOfExpense || 'other';
    categoryTotals[key] = (categoryTotals[key] || 0) + amount;
  }

  const categories = Object.entries(categoryTotals)
    .map(([key, amount]) => ({
      key,
      name: COST_LABELS[key] || key,
      value: amount,
      percent: spent > 0 ? (amount / spent) * 100 : 0,
      color: CATEGORY_COLORS[key] || CATEGORY_COLORS.other,
    }))
    .sort((a, b) => b.value - a.value);

  const months = [];
  for (let index = 5; index >= 0; index -= 1) {
    const monthDate = startOfMonth(subMonths(now, index));
    months.push({
      key: format(monthDate, 'yyyy-MM'),
      label: format(monthDate, 'MMM'),
      cost: 0,
      income: 0,
    });
  }

  const monthMap = Object.fromEntries(months.map((month) => [month.key, month]));

  for (const expense of expenses) {
    if ((expense.currency || 'RSD') !== currency) {
      continue;
    }

    const date = parseDate(expense.date);
    if (!date) {
      continue;
    }

    const month = monthMap[format(startOfMonth(date), 'yyyy-MM')];
    if (!month) {
      continue;
    }

    const amount = Number(expense.amount) || 0;
    if (getKind(expense) === 'income') {
      month.income += amount;
    } else {
      month.cost += amount;
    }
  }

  return {
    spent,
    earned,
    balance: earned - spent,
    costCount,
    incomeCount,
    categories,
    months,
  };
}
