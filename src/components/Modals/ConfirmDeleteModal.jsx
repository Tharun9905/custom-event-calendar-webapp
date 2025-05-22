import React from 'react';
import styled from 'styled-components';
import { useEvents } from '../../contexts/EventContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ConfirmButton = styled.button`
  background-color: #dc3545; /* Red for delete */
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #c82333;
  }
`;

const CancelButton = styled.button`
  background-color: #6c757d; /* Gray for cancel */
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

function ConfirmDeleteModal({ isOpen, onClose, eventToDelete }) {
  const { deleteEvent } = useEvents();

  if (!isOpen || !eventToDelete) return null; // Don't render if not open or no event to delete

  const handleDelete = () => {
    deleteEvent(eventToDelete.id); // Call the delete action from context
    onClose(); // Close the modal
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete the event: <strong>"{eventToDelete.title}"</strong>?</p>
        <ButtonGroup>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <ConfirmButton onClick={handleDelete}>Delete</ConfirmButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ConfirmDeleteModal;