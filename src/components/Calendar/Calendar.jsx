import React, { useState } from 'react';
import styled from 'styled-components';
import {
  formatMonthYear,
  goToNextMonth,
  goToPreviousMonth,
  getDaysInMonthGrid,
  isToday,
  getMonthStart // Important for determining if a day belongs to the current displayed month
} from '../../utils/dateUtils';
import DayCell from './DayCell';
import { useEvents } from '../../contexts/EventContext';

const CalendarWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 900px; /* Max width for larger screens */
  margin: 20px auto; /* Center the calendar */
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 1rem;
`;

const NavButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const MonthDisplay = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
`;

const DaysOfWeek = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 7 equal columns for days of the week */
  text-align: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #555;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden; /* Ensures borders are contained */
`;

const DayName = styled.div`
  padding: 0.5rem;
  background-color: #f8f8f8;
  border-bottom: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  &:last-child {
    border-right: none;
  }
`;

function Calendar({ onAddEventClick, onEditEventClick, onDeleteEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date()); // State for the currently displayed month
  const { getEventsForDay } = useEvents(); // Get events for a specific day from context

  // Generate all days to display in the calendar grid (includes days from prev/next months)
  const daysInGrid = getDaysInMonthGrid(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <CalendarWrapper>
      <CalendarHeader>
        <NavButton onClick={() => setCurrentDate(goToPreviousMonth(currentDate))}>
          &lt; Previous
        </NavButton>
        <MonthDisplay>{formatMonthYear(currentDate)}</MonthDisplay>
        <NavButton onClick={() => setCurrentDate(goToNextMonth(currentDate))}>
          Next &gt;
        </NavButton>
      </CalendarHeader>

      <DaysOfWeek>
        {weekDays.map((day) => (
          <DayName key={day}>{day}</DayName>
        ))}
      </DaysOfWeek>

      <CalendarGrid>
        {daysInGrid.map((day) => (
          <DayCell
            key={day.toISOString()} // Unique key for each day cell
            date={day}
            // Check if the day belongs to the currently displayed month
            isCurrentMonth={getMonthStart(day).getMonth() === getMonthStart(currentDate).getMonth()}
            isToday={isToday(day)}
            events={getEventsForDay(day)} // Pass events relevant to this day
            onAddEvent={onAddEventClick}
            onEditEvent={onEditEventClick}
            onDeleteEvent={onDeleteEventClick}
          />
        ))}
      </CalendarGrid>
    </CalendarWrapper>
  );
}

export default Calendar;