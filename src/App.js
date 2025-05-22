import React from 'react';
import { EventProvider } from './contexts/EventContext';
import Calendar from './components/Calendar/Calendar';

import AddEditEventModal from './components/Modals/AddEditEventModal.jsx'; // Add .jsx extension
import ConfirmDeleteModal from './components/Modals/ConfirmDeleteModal';
import styled from 'styled-components';

// Basic container for the whole app
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  background-color: #f0f2f5;
`;

const Header = styled.header`
  background-color: #007bff;
  color: white;
  padding: 1rem;
  text-align: center;
  font-size: 1.8rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

function App() {
  const [isAddEditModalOpen, setIsAddEditModalOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [eventToDelete, setEventToDelete] = React.useState(null);
  const [initialDateForAdd, setInitialDateForAdd] = React.useState(null);

  return (
    <EventProvider>
      <AppContainer>
        <Header>Custom Event Calendar</Header>
        <Calendar
          // Callbacks to open modals from Calendar components
          onAddEventClick={(date) => {
            setInitialDateForAdd(date);
            setIsAddEditModalOpen(true);
            setEditingEvent(null); // Ensure no event is being edited
          }}
          onEditEventClick={(event) => {
            setEditingEvent(event);
            setIsAddEditModalOpen(true);
          }}
          onDeleteEventClick={(event) => {
            setEventToDelete(event);
            setIsDeleteModalOpen(true);
          }}
        />
        {/* Modals are rendered here, controlled by App's state */}
        <AddEditEventModal
          isOpen={isAddEditModalOpen}
          onClose={() => setIsAddEditModalOpen(false)}
          editingEvent={editingEvent}
          initialDate={initialDateForAdd}
        />
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          eventToDelete={eventToDelete}
        />
      </AppContainer>
    </EventProvider>
  );
}

export default App;