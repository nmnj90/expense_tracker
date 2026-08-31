import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ICONS } from './Select';
import { CURRENCIES, formatMoney } from '../utils/currency';
import { buildStats } from '../utils/stats';

function MoneyTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className='stats-tooltip'>
      {payload.map((entry) => (
        <p key={entry.dataKey || entry.name}>
          <span>{entry.name}</span>
          {formatMoney(entry.value, currency)}
        </p>
      ))}
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const root = document.getElementById('app') || document.getElementById('root');
    if (!root || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 0;
      setIsMobile(width <= 768);
    });

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return isMobile;
}

export default function Statistics({ expenses }) {
  const [range, setRange] = useState('all');
  const [currency, setCurrency] = useState('RSD');
  const isMobile = useIsMobile();
  const stats = useMemo(
    () => buildStats(expenses, { currency, range }),
    [expenses, currency, range],
  );
  const pieInner = isMobile ? 42 : 58;
  const pieOuter = isMobile ? 68 : 88;
  const chartHeight = isMobile ? 180 : 220;

  return (
    <section className='stats' aria-labelledby='stats-title'>
      <div className='stats__header'>
        <h2 id='stats-title' className='dashboard__section-title'>
          Statistics
        </h2>
        <div className='stats__filters'>
          <div className='stats__ranges' role='tablist' aria-label='Time range'>
            <button
              type='button'
              className={`btn btn--ghost${range === 'month' ? ' is-active' : ''}`}
              onClick={() => setRange('month')}
            >
              This month
            </button>
            <button
              type='button'
              className={`btn btn--ghost${range === 'all' ? ' is-active' : ''}`}
              onClick={() => setRange('all')}
            >
              All time
            </button>
          </div>
          <label className='stats__currency'>
            <span className='form-label'>Currency</span>
            <select
              className='form-input'
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
            >
              {CURRENCIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className='stats__cards'>
        <article className='stats-card stats-card--cost'>
          <p>Spent</p>
          <strong>{formatMoney(stats.spent, currency)}</strong>
          <span>{stats.costCount} costs</span>
        </article>
        <article className='stats-card stats-card--income'>
          <p>Earned</p>
          <strong>{formatMoney(stats.earned, currency)}</strong>
          <span>{stats.incomeCount} incomes</span>
        </article>
        <article
          className={`stats-card stats-card--balance${
            stats.balance >= 0 ? ' is-positive' : ' is-negative'
          }`}
        >
          <p>Balance</p>
          <strong>{formatMoney(stats.balance, currency, { signed: true })}</strong>
          <span>{range === 'month' ? 'This month' : 'All time'}</span>
        </article>
      </div>

      <div className='stats__grid'>
        <article className='stats-panel'>
          <h3>Costs by category</h3>
          {stats.categories.length === 0 ? (
            <p className='stats-panel__empty'>No costs in this period.</p>
          ) : (
            <div className='stats-panel__body'>
              <div className='stats-panel__chart'>
                <ResponsiveContainer width='100%' height={chartHeight}>
                  <PieChart>
                    <Pie
                      data={stats.categories}
                      dataKey='value'
                      nameKey='name'
                      innerRadius={pieInner}
                      outerRadius={pieOuter}
                      paddingAngle={2}
                    >
                      {stats.categories.map((category) => (
                        <Cell key={category.key} fill={category.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<MoneyTooltip currency={currency} />}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className='stats-breakdown'>
                {stats.categories.map((category) => (
                  <li key={category.key}>
                    <span className='stats-breakdown__label'>
                      <span
                        className='stats-breakdown__icon'
                        style={{ color: category.color }}
                      >
                        {ICONS[category.key] || ICONS.other}
                      </span>
                      {category.name}
                    </span>
                    <span className='stats-breakdown__bar' aria-hidden='true'>
                      <span
                        style={{
                          width: `${Math.max(category.percent, 4)}%`,
                          background: category.color,
                        }}
                      />
                    </span>
                    <strong>{formatMoney(category.value, currency)}</strong>
                    <span className='stats-breakdown__percent'>
                      {Math.round(category.percent)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        <article className='stats-panel'>
          <h3>Last 6 months</h3>
          <div className='stats-panel__chart stats-panel__chart--bar'>
            <ResponsiveContainer width='100%' height={chartHeight}>
              <BarChart
                data={stats.months}
                margin={{ top: 8, right: 8, left: isMobile ? -12 : 0, bottom: 0 }}
              >
                <XAxis dataKey='label' tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={isMobile ? 32 : 56}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('sr-RS', {
                      notation: 'compact',
                      maximumFractionDigits: 1,
                    }).format(value)
                  }
                />
                <Tooltip content={<MoneyTooltip currency={currency} />} />
                <Bar dataKey='cost' name='Cost' fill='#b24848' radius={[6, 6, 0, 0]} />
                <Bar
                  dataKey='income'
                  name='Income'
                  fill='#2f7d57'
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  );
}
