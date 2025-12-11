import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function StatsCard({ label, value, subtitle, valueColor = 'text.primary' }) {
  return (
    <Card>
      <CardContent>
        <Typography 
          variant="caption" 
          sx={{ 
            textTransform: 'uppercase', 
            fontWeight: 700, 
            color: 'text.secondary',
            display: 'block',
            mb: 1
          }}
        >
          {label}
        </Typography>
        
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 800,
            color: valueColor,
            mb: 0.5
          }}
        >
          {value}
        </Typography>
        
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}
