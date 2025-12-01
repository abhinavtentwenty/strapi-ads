import { subDays, subMonths, subYears } from 'date-fns';

const getTimeframeDate = (timeframe) => {
  const now = new Date();

  switch (timeframe) {
    case 'last_7_days':
      return subDays(now, 7);
    case 'last_30_days':
      return subDays(now, 30);
    case 'last_3_months':
      return subMonths(now, 3);
    case 'last_6_months':
      return subMonths(now, 6);
    case 'last_year':
      return subYears(now, 1);
    default:
      return null;
  }
};

export default getTimeframeDate;
