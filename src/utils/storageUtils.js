export const saveEvents = (events) => {
  try {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  } catch (error) {
    console.error("Error saving events to localStorage:", error);
  }
};

export const loadEvents = () => {
  try {
    const serializedEvents = localStorage.getItem('calendarEvents');
    if (serializedEvents === null) {
      return []; // Return empty array if nothing is found
    }
    // Parse the JSON string back to objects
    // Important: Convert date strings back to Date objects
    return JSON.parse(serializedEvents).map(event => ({
      ...event,
      date: new Date(event.date), // Convert date string back to Date object
    }));
  } catch (error) {
    console.error("Error loading events from localStorage:", error);
    return []; // Return empty array on error
  }
};