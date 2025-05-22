import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Generates unique IDs
import { saveEvents, loadEvents } from '../utils/storageUtils';
import { generateRecurringEvents } from '../utils/recurrenceUtils';
import { isSameDay, startOfDay } from 'date-fns';

export const EventContext = createContext();

// Reducer function to handle state changes for events
const eventReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_EVENT':
      return [...state, { id: uuidv4(), ...action.payload }];
    case 'EDIT_EVENT':
      return state.map((event) =>
        event.id === action.payload.id ? { ...event, ...action.payload } : event
      );
    case 'DELETE_EVENT':
      return state.filter((event) => event.id !== action.payload.id);
    case 'LOAD_EVENTS':
      return action.payload; // For initial loading from storage
    default:
      return state;
  }
};

export const EventProvider = ({ children }) => {
  // Initialize state from localStorage, only once
  const [events, dispatch] = useReducer(eventReducer, [], () => {
    return loadEvents();
  });

  // Save events to localStorage whenever the 'events' state changes
  useEffect(() => {
    saveEvents(events);
  }, [events]);

  // Actions to dispatch changes
  const addEvent = (newEvent) => {
    dispatch({ type: 'ADD_EVENT', payload: newEvent });
  };

  const editEvent = (updatedEvent) => {
    dispatch({ type: 'EDIT_EVENT', payload: updatedEvent });
  };

  const deleteEvent = (eventId) => {
    dispatch({ type: 'DELETE_EVENT', payload: { id: eventId } });
  };

  // Function to get events for a specific day, considering recurring events
  const getEventsForDay = (date) => {
    const allEvents = events.flatMap(event => {
      // If it's a recurring event, generate its instances for the view
      if (event.recurrence && event.recurrence.type !== 'none') {
        // We generate instances for the current day only to avoid performance issues
        // in a larger calendar, you'd pre-generate for the month/week view.
        return generateRecurringEvents(event, startOfDay(date), startOfDay(date));
      }
      return [event]; // Non-recurring event
    });

    // Filter to only include events that fall on the specific date
    return allEvents.filter(event => isSameDay(new Date(event.date), date));
  };

  return (
    <EventContext.Provider value={{ events, addEvent, editEvent, deleteEvent, getEventsForDay }}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook for easier consumption of the EventContext
export const useEvents = () => useContext(EventContext);