import { format } from 'date-fns';
import { isAfter, isBefore, isSameDay } from 'date-fns';

/**
 * Checks for time conflicts between a new event and existing events on the same day.
 * Assumes events have 'date' (Date object), 'startTime' (e.g., "09:00"), 'endTime' (e.g., "10:00").
 * @param {Object} newEvent - The event to check for conflicts.
 * @param {Array} existingEvents - Array of events already on the calendar for that day.
 * @returns {boolean} True if a conflict exists, false otherwise.
 */
export const checkConflicts = (newEvent, existingEvents) => {
  // If the new event doesn't have start/end times, it's considered an all-day event
  // or a placeholder, and for simplicity, won't conflict with timed events.
  // Adjust this logic if all-day events should conflict.
  if (!newEvent.startTime || !newEvent.endTime) {
    return false; // No time specified, so no time conflict in this simple model
  }

  // Create Date objects for comparison, combining date and time
  const newEventStartTime = new Date(`${format(newEvent.date, 'yyyy-MM-dd')}T${newEvent.startTime}:00`);
  const newEventEndTime = new Date(`${format(newEvent.date, 'yyyy-MM-dd')}T${newEvent.endTime}:00`);


  for (const existingEvent of existingEvents) {
    // Skip checking conflict with itself when editing or moving
    if (newEvent.id && newEvent.id === existingEvent.id) {
      continue;
    }

    // Skip if existing event has no time or is not on the same day (should be filtered by getEventsForDay already)
    if (!existingEvent.startTime || !existingEvent.endTime || !isSameDay(newEvent.date, existingEvent.date)) {
      continue;
    }

    const existingEventStartTime = new Date(`${format(existingEvent.date, 'yyyy-MM-dd')}T${existingEvent.startTime}:00`);
    const existingEventEndTime = new Date(`${format(existingEvent.date, 'yyyy-MM-dd')}T${existingEvent.endTime}:00`);

    // Check for overlap conditions:
    // 1. New event starts before existing event ends AND new event ends after existing event starts
    // 2. New event starts at the same time as existing event OR new event ends at the same time
    if (
      (isBefore(newEventStartTime, existingEventEndTime) && isAfter(newEventEndTime, existingEventStartTime)) ||
      (newEventStartTime.getTime() === existingEventStartTime.getTime() && newEventEndTime.getTime() === existingEventEndTime.getTime())
    ) {
      return true; // Conflict detected
    }
  }
  return false; // No conflict
};
