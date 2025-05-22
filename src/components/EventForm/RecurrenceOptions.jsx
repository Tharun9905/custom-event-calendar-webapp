// src/components/EventForm/RecurrenceOptions.jsx

import styled from 'styled-components';

// This is the 'Select' styled component definition.
// It was causing a warning earlier when defined but not used in EventForm.jsx.
// It belongs here because RecurrenceOptions will use a <select> element.
const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  width: 100%; /* Make it fill the available width */
`;

const RecurrenceOptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
`;

// This component manages the recurrence options
function RecurrenceOptions({ recurrence, onChange }) {
  const handleRecurrenceTypeChange = (e) => {
    const newType = e.target.value;
    onChange({ type: newType }); // Update the recurrence type
  };

  // You can expand this logic later to show more options
  // based on recurrence.type (e.g., for 'weekly' show day checkboxes)

  return (
    <RecurrenceOptionsWrapper>
      <Label htmlFor="recurrence-type">Recurrence</Label>
      <Select
        id="recurrence-type"
        name="recurrence-type"
        value={recurrence.type}
        onChange={handleRecurrenceTypeChange}
      >
        <option value="none">None</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </Select>

      {/* You can add more options here based on recurrence.type */}
      {/* For example:
      {recurrence.type === 'weekly' && (
        <div>
          <label>Repeat every:</label>
          <input type="number" value={recurrence.interval || 1} onChange={(e) => onChange({ ...recurrence, interval: e.target.value })} />
          <label>week(s)</label>
        </div>
      )}
      */}
    </RecurrenceOptionsWrapper>
  );
}

export default RecurrenceOptions;
