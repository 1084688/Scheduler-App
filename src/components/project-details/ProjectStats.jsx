import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

export default function ProjectStats({ 
  formatDate, deadline, daysRemaining, 
  projectMode, paidAmount, totalRevenue, 
  totalExpenses, netProfit 
}) {
  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, 
      gap: 3, 
      mb: 4 
    }}>
      <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: '#64748b', display: 'block', mb: 1 }}>
            Deadline
          </Typography>
          <Typography variant="h4" sx={{ mb: 1, color: 'white', fontWeight: 700 }}>
            {formatDate(deadline)}
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            {daysRemaining} days remaining
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: '#64748b', display: 'block', mb: 1 }}>
            {projectMode === 'awarded' ? 'Paid Amount' : 'Revenue'}
          </Typography>
          <Typography variant="h4" sx={{ mb: 1, color: '#22d3ee', fontWeight: 700 }}>
            {paidAmount.toLocaleString()} <span style={{ fontSize: '0.8em' }}>AED</span>
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            {projectMode === 'awarded' ? `of ${totalRevenue.toLocaleString()} AED` : 'From completed tasks'}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: '#64748b', display: 'block', mb: 1 }}>
            Expenses
          </Typography>
          <Typography variant="h4" sx={{ mb: 1, color: '#ef4444', fontWeight: 700 }}>
            {totalExpenses.toLocaleString()} <span style={{ fontSize: '0.8em' }}>AED</span>
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Total spent
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: '#64748b', display: 'block', mb: 1 }}>
            Net Profit
          </Typography>
          <Typography variant="h4" sx={{ mb: 1, color: netProfit >= 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
            {netProfit.toLocaleString()} <span style={{ fontSize: '0.8em' }}>AED</span>
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Revenue - Expenses
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
