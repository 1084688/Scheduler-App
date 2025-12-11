import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

export default function FormattedNumberInput({ value, onChange, name, ...props }) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value === '' || value === null || value === undefined) {
      setDisplayValue('');
    } else {
      // Convert to string and format with commas
      const numStr = value.toString().replace(/,/g, '');
      setDisplayValue(numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    }
  }, [value]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    // Remove all non-digit characters
    const cleanedValue = inputValue.replace(/[^\d]/g, '');
    
    // Update display with commas
    if (cleanedValue === '') {
      setDisplayValue('');
      onChange({ target: { name, value: '' } });
    } else {
      // Format display with commas
      const formatted = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setDisplayValue(formatted);
      
      // Pass the RAW NUMBER STRING (not parsed float) to maintain precision
      onChange({ target: { name, value: cleanedValue } });
    }
  };

  return (
    <TextField
      {...props}
      name={name}
      value={displayValue}
      onChange={handleChange}
      inputProps={{
        inputMode: 'numeric',
        ...props.inputProps
      }}
    />
  );
}
