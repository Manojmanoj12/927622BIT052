
import React from 'react';
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Slider,
  Typography,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import { AccessTime, TrendingUp } from '@mui/icons-material';

interface StockSelectorProps {
  selectedStock: string;
  onStockChange: (stock: string) => void;
  timeRange: number;
  onTimeRangeChange: (range: number) => void;
  availableStocks: Record<string, string>;
  loading?: boolean;
}

const timeMarks = [
  { value: 5, label: '5m' },
  { value: 15, label: '15m' },
  { value: 30, label: '30m' },
  { value: 60, label: '1h' },
  { value: 120, label: '2h' },
];

const StockSelector: React.FC<StockSelectorProps> = ({
  selectedStock,
  onStockChange,
  timeRange,
  onTimeRangeChange,
  availableStocks,
  loading = false,
}) => {
  const handleStockChange = (event: SelectChangeEvent) => {
    onStockChange(event.target.value);
  };

  const handleTimeRangeChange = (event: Event, newValue: number | number[]) => {
    onTimeRangeChange(newValue as number);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="stock-select-label">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp fontSize="small" />
                Select Stock
              </Box>
            </InputLabel>
            <Select
              labelId="stock-select-label"
              value={selectedStock}
              onChange={handleStockChange}
              disabled={loading}
              label="Select Stock"
            >
              {Object.entries(availableStocks).map(([name, ticker]) => (
                <MenuItem key={ticker} value={ticker}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {ticker}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {name}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ px: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AccessTime fontSize="small" color="primary" />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Time Range: {timeRange} minutes
              </Typography>
            </Box>
            <Slider
              value={timeRange}
              onChange={handleTimeRangeChange}
              min={5}
              max={120}
              step={5}
              marks={timeMarks}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}m`}
              disabled={loading}
              sx={{
                '& .MuiSlider-markLabel': {
                  fontSize: '0.75rem',
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StockSelector;
