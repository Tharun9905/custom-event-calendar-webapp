import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useEvents } from '../../contexts/EventContext';
import { checkConflicts } from '../../utils/conflictUtils';
import { format, parseISO } from 'date-fns';
import RecurrenceOptions from './RecurrenceOptions';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Space between form groups */
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical; /* Allow vertical resizing */
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end; /* Align buttons to the right */
  gap: 0.5rem;
  margin-top: 1rem;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const CancelButton = styled.button`
  background-color: #6c757d;
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

const ErrorMessage = styled.p`
  color: red;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const initialFormState = {
  title: '',
  date: format(new Date(), 'yyyy-MM-dd'), // Default to today's date
  startTime: '09:00',
  endTime: '10:00',
  description: '',
  color: '#007bff', // Default event color
  recurrence: { type: 'none' }, // Default recurrence option
};

function EventForm({ event, initialDate, onSave, onCancel }) {
  const { addEvent, editEvent, getEventsForDay } = useEvents();
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');

  // Effect to populate form data when editing an event or setting initial date for new event
  useEffect(() => {
    if (event) {
      // If 'event' prop is provided, we are in edit mode
      setFormData({
        id: event.id,
        title: event.title,
        date: format(event.date, 'yyyy-MM-dd'), // Format Date object back to string for input
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        description: event.description || '',
        color: event.color || '#007bff',
        recurrence: event.recurrence || { type: 'none' },
      });
    } else if (initialDate) {
      // If 'initialDate' prop is provided, we are adding for a specific date
      setFormData((prev) => ({
        ...prev,
        date: format(initialDate, 'yyyy-MM-dd'),
      }));
    } else {
      // Otherwise, reset to initial state (for new event without initial date)
      setFormData(initialFormState);
    }
    setError(''); // Clear any previous errors
  }, [event, initialDate]); // Re-run when event or initialDate changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecurrenceChange = (newRecurrence) => {
    setFormData((prev) => ({ ...prev, recurrence: newRecurrence }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Basic validation
    if (!formData.title.trim()) {
      setError('Event title is required.');
      return;
    }
    if (!formData.date) {
      setError('Event date is required.');
      return;
    }

    const eventDate = parseISO(formData.date); // Convert date string from input to Date object
    const eventToSave = {
      ...formData,
      date: eventDate, // Ensure the date is a Date object for storage/logic
    };

    // Get events already on the target day for conflict checking
    // Filter out the event itself if we are editing it
    const eventsOnTargetDay = getEventsForDay(eventDate).filter(
      (ev) => ev.id !== eventToSave.id // Exclude the current event if editing
    );

    // Check for conflicts
    if (checkConflicts(eventToSave, eventsOnTargetDay)) {
      setError('This event conflicts with an existing event on this day.');
      return;
    }

    // Add or edit event based on whether an ID exists
    if (eventToSave.id) {
      editEvent(eventToSave);
    } else {
      addEvent(eventToSave);
    }
    onSave(); // Close the modal on successful save/add
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="title">Event Title</Label>
        <Input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="date">Date</Label>
        <Input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="startTime">Time</Label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
          />
          to
          <Input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
          />
        </div>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="description">Description</Label>
        <TextArea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        ></TextArea>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="color">Event Color</Label>
        <Input
          type="color"
          id="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
        />
      </FormGroup>

      {/* Recurrence options component */}
      <RecurrenceOptions
        recurrence={formData.recurrence}
        onChange={handleRecurrenceChange}
      />

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ButtonGroup>
        <CancelButton type="button" onClick={onCancel}>
          Cancel
        </CancelButton>
        <SubmitButton type="submit">
          {event ? 'Update Event' : 'Add Event'}
        </SubmitButton>
      </ButtonGroup>
    </Form>
  );
}

export default EventForm;
