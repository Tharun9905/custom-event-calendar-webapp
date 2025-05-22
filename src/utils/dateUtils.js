import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameDay,
  isToday,
  getDay, // Day of week (0-6)
  getDate, // Day of month (1-31)
  parseISO, // For parsing ISO 8601 date strings
  isBefore,
  isAfter,
  startOfDay,
  endOfDay
} from 'date-fns';

// Constants for week start (Sunday = 0, Monday = 1, etc.)
const WEEK_STARTS_ON = 0; // Sunday

export const getMonthStart = (date) => startOfMonth(date);
export const getMonthEnd = (date) => endOfMonth(date);
export const getWeekStart = (date) => startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON });
export const getWeekEnd = (date) => endOfWeek(date, { weekStartsOn: WEEK_STARTS_ON });

// Generates an array of all days to display in the calendar grid for a given month
export const getDaysInMonthGrid = (date) => {
  const start = getWeekStart(getMonthStart(date));
  const end = getWeekEnd(getMonthEnd(date));
  return eachDayOfInterval({ start, end });
};

export const formatDay = (date, fmt = 'd') => format(date, fmt);
export const formatMonthYear = (date, fmt = 'MMMM yyyy') => format(date, fmt);

export const goToNextMonth = (date) => addMonths(date, 1);
export const goToPreviousMonth = (date) => subMonths(date, 1);

// Re-export useful date-fns functions
export {
  isSameDay,
  isToday,
  parseISO,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  getDay,
  getDate
};