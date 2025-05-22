import {
  isSameDay,
  addDays,
  addWeeks,
  addMonths,
  getDay, // 0 for Sunday, 6 for Saturday
  getDate, // Day of month (1-31)
  format,
  startOfDay
} from 'date-fns';

// Helper to check if a date matches a weekly pattern (e.g., [0, 2] for Sun, Tue)
const matchesWeeklyPattern = (date, selectedDaysOfWeek) => {
  const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, etc.
  return selectedDaysOfWeek && selectedDaysOfWeek.includes(dayOfWeek);
};

// Helper to check if a date matches a monthly pattern (e.g., 15th of the month)
const matchesMonthlyPattern = (date, dayOfMonth) => {
  return getDate(date) === dayOfMonth;
};

/**
 * Generates instances of a recurring event within a specified date range.
 * This implementation is simplified for demonstration. A full-featured recurring
 * event system would be more robust (e.g., handling 'until' dates, exceptions).
 *
 * @param {Object} event - The base event object with a `recurrence` property.
 * @param {Date} startDateRange - The start date of the range to generate events for.
 * @param {Date} endDateRange - The end date of the range to generate events for.
 * @returns {Array} An array of event instances.
 */
export const generateRecurringEvents = (event, startDateRange, endDateRange) => {
  if (!event.recurrence || event.recurrence.type === 'none') {
    return []; // Not a recurring event or no recurrence set
  }

  const instances = [];
  let currentDate = startOfDay(new Date(event.date)); // Start from the original event's start date
  const rangeStart = startOfDay(startDateRange);
  const rangeEnd = endOfDay(endDateRange);

  // Optimization: If the event's original date is far before the range,
  // jump closer to the range start if possible for performance.
  // This is a basic optimization; for complex recurrence, you'd pre-calculate the first occurrence in the range.
  while (currentDate < rangeStart) {
      if (event.recurrence.type === 'daily') {
          currentDate = addDays(currentDate, 1);
      } else if (event.recurrence.type === 'weekly') {
          currentDate = addWeeks(currentDate, 1);
      } else if (event.recurrence.type === 'monthly') {
          currentDate = addMonths(currentDate, 1);
          // If monthly, ensure we land on the correct day of the month for the next interval
          // This is a complex problem; for simplicity, we let the day-by-day loop handle it.
      } else { // Custom or other types, just increment by day or break
          currentDate = addDays(currentDate, 1);
      }
      // Prevent infinite loops if recurrence makes no sense or date is stuck
      if (currentDate.getTime() === new Date(event.date).getTime()) {
          console.warn("Recurrence logic stuck, breaking loop. Check recurrence pattern.", event);
          break;
      }
      if (currentDate > rangeEnd) break; // If we jumped past the range, stop.
  }

  // Ensure current date is at least the range start if it's still before it
  currentDate = currentDate < rangeStart ? rangeStart : currentDate;

  while (currentDate <= rangeEnd) {
    let shouldAdd = false;

    switch (event.recurrence.type) {
      case 'daily':
        shouldAdd = true;
        break;
      case 'weekly':
        shouldAdd = matchesWeeklyPattern(currentDate, event.recurrence.daysOfWeek);
        break;
      case 'monthly':
        shouldAdd = matchesMonthlyPattern(currentDate, event.recurrence.dayOfMonth);
        break;
      case 'custom':
        // For custom: 'every X days/weeks/months'
        const interval = event.recurrence.interval || 1;
        const unit = event.recurrence.unit || 'days';

        // Calculate difference from the original event's start date
        const diffInMs = currentDate.getTime() - new Date(event.date).getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (unit === 'days') {
          shouldAdd = (diffInDays % interval === 0);
        } else if (unit === 'weeks') {
          // Check if it's on the correct day of the week AND the correct week interval
          const diffInWeeks = diffInDays / 7;
          shouldAdd = (diffInWeeks % interval === 0) && (getDay(currentDate) === getDay(new Date(event.date)));
        } else if (unit === 'months') {
          // This is a very simplistic check for months. More complex logic needed for exact month interval.
          // For now, checks if it's on the same day of the month as the original AND correct month interval
          const originalMonth = new Date(event.date).getMonth();
          const currentMonth = currentDate.getMonth();
          const diffMonths = (currentDate.getFullYear() * 12 + currentMonth) -
                             (new Date(event.date).getFullYear() * 12 + originalMonth);
          shouldAdd = (diffMonths % interval === 0) && (getDate(currentDate) === getDate(new Date(event.date)));
        }
        break;
      default:
        break;
    }

    if (shouldAdd) {
      instances.push({
        ...event,
        // Generate a unique ID for each instance to allow individual instance manipulation (if needed)
        // For simplicity, we just append date. In a real app, you might use a more robust instance ID.
        id: `${event.id}-${format(currentDate, 'yyyyMMdd')}`,
        parentId: event.id, // Reference to the original recurring event
        date: currentDate, // This specific instance's date
        isRecurringInstance: true,
      });
    }

    // Move to the next day
    currentDate = addDays(currentDate, 1);
  }

  // If the original event date falls within the range, ensure it's included as well
  // (unless it's already generated by the recurrence logic and has a parentId)
  if (!event.isRecurringInstance && isSameDay(new Date(event.date), startDateRange) && !instances.find(inst => isSameDay(inst.date, new Date(event.date)) && inst.id === event.id)) {
     // Check if the original event itself (not an instance) should be added.
     // This prevents the original event being added if its recurrence logic already included it.
     if (event.recurrence.type === 'none' ||
         (event.recurrence.type === 'daily' && isSameDay(new Date(event.date), rangeStart)) ||
         (event.recurrence.type === 'weekly' && isSameDay(new Date(event.date), rangeStart) && matchesWeeklyPattern(new Date(event.date), event.recurrence.daysOfWeek)) ||
         (event.recurrence.type === 'monthly' && isSameDay(new Date(event.date), rangeStart) && matchesMonthlyPattern(new Date(event.date), event.recurrence.dayOfMonth)) ||
         (event.recurrence.type === 'custom' && isSameDay(new Date(event.date), rangeStart))) {
        instances.push({ ...event, date: new Date(event.date) }); // Ensure it's a new Date object
    }
  }


  // Remove duplicates if the original event is also generated as an instance
  const uniqueInstances = Array.from(new Set(instances.map(inst => inst.id)))
    .map(id => instances.find(inst => inst.id === id));


  // Sort instances by date and then by time
  uniqueInstances.sort((a, b) => {
    const dateA = a.date.getTime();
    const dateB = b.date.getTime();

    if (dateA !== dateB) return dateA - dateB;

    // If same day, sort by start time (assuming HH:mm format)
    const timeA = a.startTime ? parseInt(a.startTime.replace(':', ''), 10) : 0;
    const timeB = b.startTime ? parseInt(b.startTime.replace(':', ''), 10) : 0;
    return timeA - timeB;
  });

  return uniqueInstances;
};