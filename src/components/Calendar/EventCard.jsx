import React from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { format } from 'date-fns';

const EventCardWrapper = styled.div`
  background-color: ${(props) => props.$color || '#6c757d'}; /* Use event's color */
  color: white;
  padding: 5px 8px;
  margin-bottom: 5px;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: grab; /* Indicates draggable */
  position: relative;
  opacity: ${(props) => (props.$isDragging ? 0.5 : 1)}; /* Visual feedback when dragging */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  word-break: break-word; /* Ensure long titles wrap */
  white-space: nowrap; /* Prevent text from wrapping by default */
  overflow: hidden;
  text-overflow: ellipsis; /* Add ellipsis for overflowed text */
  transition: opacity 0.15s ease-in-out; /* Smooth opacity change */

  &:hover {
    filter: brightness(1.1); /* Slightly brighten on hover */
  }
`;

const EventTitle = styled.div`
  font-weight: bold;
`;

const EventTime = styled.div`
  font-size: 0.65rem;
  opacity: 0.9;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  position: absolute;
  top: 2px;
  right: 2px;
  padding: 2px;
  line-height: 1; /* Adjust line height for better alignment */
  &:hover {
    color: #ffcccc;
  }
`;

function EventCard({ event, onClick, onDelete }) {
  // useDrag hook makes this component draggable
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'event', // The type of draggable item, must match the 'accept' on the drop target
    item: { event: event }, // The data associated with the dragged item (the whole event object)
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // True if the item is currently being dragged
    }),
  }));

  return (
    <EventCardWrapper
      ref={drag} // Attach the drag source ref
      $color={event.color}
      $isDragging={isDragging}
      onClick={onClick}
      title={`${event.title} (${format(event.date, 'MMM d, yyyy')}${event.startTime ? ' ' + event.startTime : ''}${event.endTime ? '-' + event.endTime : ''})`}
    >
      <EventTitle>{event.title}</EventTitle>
      {(event.startTime || event.endTime) && (
        <EventTime>
          {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}
        </EventTime>
      )}
      <DeleteButton onClick={(e) => { e.stopPropagation(); onDelete(event); }}>
        &times;
      </DeleteButton>
    </EventCardWrapper>
  );
}

export default EventCard;