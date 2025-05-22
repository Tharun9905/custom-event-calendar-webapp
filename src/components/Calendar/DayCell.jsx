// src/components/Calendar/DayCell.jsx

import styled from 'styled-components';
// REMOVE 'isSameDay' as it's unused in this file
import { format } from 'date-fns'; // CORRECTED IMPORT
import EventCard from './EventCard';
import { useDrop } from 'react-dnd';
import { useEvents } from '../../contexts/EventContext';

import { checkConflicts } from '../../utils/conflictUtils.js'; // Add .js extension

const DayCellWrapper = styled.div`
  border: 1px solid #eee;
  min-height: 120px; /* Minimum height for day cells */
  padding: 8px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.$isCurrentMonth ? 'white' : '#f9f9f9')};
  ${(props) => props.$isToday && 'border: 2px solid #007bff;'} /* Highlight current day */
  position: relative;
  overflow: hidden;
  box-sizing: border-box; /* Include padding and border in element's total size */
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.$isCurrentMonth ? '#f0f0f0' : '#f9f9f9')};
  }
`;

const DayNumber = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: ${(props) => (props.$isToday ? '#007bff' : '#333')};
  align-self: flex-end; /* Position day number to the top-right */
`;

const EventList = styled.div`
  flex-grow: 1; /* Allow events to take up available space */
  overflow-y: auto; /* Enable scrolling if too many events */
  -ms-overflow-style: none; /* IE and Edge scrollbar hide */
  scrollbar-width: none; /* Firefox scrollbar hide */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera scrollbar hide */
  }
`;

const AddEventButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 0.8rem;
  align-self: flex-end; /* Push to bottom right */
  margin-top: auto; /* Push to bottom */
  opacity: 0.9;
  transition: background-color 0.2s ease, opacity 0.2s ease;

  &:hover {
    background-color: #218838;
    opacity: 1;
  }
`;

function DayCell({ date, isCurrentMonth, isToday, events, onAddEvent, onEditEvent, onDeleteEvent }) {
  const { editEvent, getEventsForDay } = useEvents();

  // useDrop hook for drag-and-drop target functionality
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'event', // This must match the 'type' defined in useDrag (EventCard)
    drop: (item) => {
      const newDate = date; // The date of the day cell where the event is dropped
      const originalEvent = item.event;

      // Ensure the event's date is updated to the new date.
      const updatedEvent = { ...originalEvent, date: newDate };

      // Get all events for the target day *including* the event being moved
      const eventsOnTargetDay = getEventsForDay(newDate).filter(
        (ev) => ev.id !== originalEvent.id // Exclude the original event itself from conflict check
      );

      // Check for conflicts before dispatching the edit action
      const conflicts = checkConflicts(updatedEvent, eventsOnTargetDay);

      if (conflicts) {
        alert('Cannot move event: Conflicts with another event on this day!'); // Simple alert for conflict
        return; // Prevent the drop action
      }

      editEvent(updatedEvent); // Dispatch action to update event date
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(), // True when an item is being dragged over this component
      canDrop: monitor.canDrop(), // True if an item is currently over this component and can be dropped
    }),
  });

  // Dynamic background color for drop feedback
  const isActive = isOver && canDrop;
  let backgroundColor = isCurrentMonth ? 'white' : '#f9f9f9';
  if (isActive) {
    backgroundColor = '#e6f7ff'; // Light blue when active drop target
  } else if (canDrop) {
    backgroundColor = '#f0faff'; // Even lighter blue when just droppable
  }

  return (
    <DayCellWrapper
      ref={drop} // Attach the drop target ref
      $isCurrentMonth={isCurrentMonth}
      $isToday={isToday}
      style={{ backgroundColor }}
      onClick={() => isCurrentMonth && onAddEvent(date)} // Open add event modal on cell click
    >
      <DayNumber $isToday={isToday}>{format(date, 'd')}</DayNumber>
      <EventList>
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={(e) => { e.stopPropagation(); onEditEvent(event); }} // Stop propagation to prevent cell click
            onDelete={(e) => { e.stopPropagation(); onDeleteEvent(event); }} // CORRECTED THIS LINE
          />
        ))}
      </EventList>
      {isCurrentMonth && (
        <AddEventButton onClick={(e) => { e.stopPropagation(); onAddEvent(date); }}>
          + Add Event
        </AddEventButton>
      )}
    </DayCellWrapper>
  );
}

export default DayCell;
