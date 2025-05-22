import React from 'react';
import styled from 'styled-components';
import EventForm from '../EventForm/EventForm';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure modal is on top */
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 500px; /* Max width for the modal */
  width: 90%; /* Responsive width */
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #555;
  line-height: 1;

  &:hover {
    color: #333;
  }
`;

function AddEditEventModal({ isOpen, onClose, editingEvent, initialDate }) {
  if (!isOpen) return null; // Don't render if not open

  return (
    <ModalOverlay onClick={onClose}> {/* Close when clicking outside modal content */}
      <ModalContent onClick={(e) => e.stopPropagation()}> {/* Prevent clicks inside from closing */}
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>{editingEvent ? 'Edit Event' : 'Add Event'}</h2>
        <EventForm
          event={editingEvent} // Pass the event if editing
          initialDate={initialDate} // Pass the initial date if adding
          onSave={onClose} // Close modal on successful save
          onCancel={onClose} // Close modal on cancel
        />
      </ModalContent>
    </ModalOverlay>
  );
}

export default AddEditEventModal;