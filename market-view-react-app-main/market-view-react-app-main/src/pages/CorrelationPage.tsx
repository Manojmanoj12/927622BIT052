
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Slider,
  SelectChangeEvent,
} from '@mui/material';
import { Calculate, AccessTime } from '@mui/icons-material';
import HeatmapChart from '../components/CorrelationHeatmap/HeatmapChart';
import { stockApi, CorrelationResponse } from '../services/stockApi';

interface CorrelationPageProps {
  availableStocks: Record<string, string>;
}

interface CorrelationData {
  ticker1: string;
  ticker2: string;
  correlation: number;
  stock1Data: {
    averagePrice: number;
    standardDeviation: number;
  };
  stock2Data: {
    averagePrice: number;
    standardDeviation: number;
  };
}

const CorrelationPage: React.FC<CorrelationPageProps> = ({ availableStocks }) => {
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState(30);
  const [correlationData, setCorrelationData] = useState<CorrelationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stockTickers = Object.values(availableStocks);

  const calculateStandardDeviation = (prices: number[]): number => {
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / (prices.length - 1);
    return Math.sqrt(variance);
  };

  const fetchCorrelationData = async () => {
    if (selectedStocks.length < 2) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const correlations: CorrelationData[] = [];
      
      // Fetch correlation data for all pairs of selected stocks
      for (let i = 0; i < selectedStocks.length; i++) {
        for (let j = i + 1; j < selectedStocks.length; j++) {
          const ticker1 = selectedStocks[i];
          const ticker2 = selectedStocks[j];
          
          try {
            const response: CorrelationResponse = await stockApi.getCorrelationData(ticker1, ticker2, timeRange);
            
            const stock1Prices = response.stocks[ticker1].priceHistory.map(p => p.price);
            const stock2Prices = response.stocks[ticker2].priceHistory.map(p => p.price);
            
            correlations.push({
              ticker1,
              ticker2,
              correlation: response.correlation,
              stock1Data: {
                averagePrice: response.stocks[ticker1].averagePrice,
                standardDeviation: calculateStandardDeviation(stock1Prices),
              },
              stock2Data: {
                averagePrice: response.stocks[ticker2].averagePrice,
                standardDeviation: calculateStandardDeviation(stock2Prices),
              },
            });
          } catch (err) {
            console.error(`Error fetching correlation for ${ticker1}-${ticker2}:`, err);
          }
        }
      }
      
      setCorrelationData(correlations);
    } catch (err) {
      setError('Failed to fetch correlation data. Please try again.');
      console.error('Error fetching correlation data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStockSelection = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const stocks = typeof value === 'string' ? value.split(',') : value;
    
    if (stocks.length <= 8) { // Limit to 8 stocks for better visualization
      setSelectedStocks(stocks);
    }
  };

  const handleTimeRangeChange = (event: Event, newValue: number | number[]) => {
    setTimeRange(newValue as number);
  };

  useEffect(() => {
    // Set default stocks if available
    if (stockTickers.length >= 4 && selectedStocks.length === 0) {
      setSelectedStocks(stockTickers.slice(0, 4));
    }
  }, [availableStocks]);

  const timeMarks = [
    { value: 5, label: '5m' },
    { value: 15, label: '15m' },
    { value: 30, label: '30m' },
    { value: 60, label: '1h' },
    { value: 120, label: '2h' },
  ];

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Correlation Analysis Configuration
        </Typography>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="stocks-select-label">Select Stocks (2-8)</InputLabel>
              <Select
                labelId="stocks-select-label"
                multiple
                value={selectedStocks}
                onChange={handleStockSelection}
                label="Select Stocks (2-8)"
                disabled={loading}
              >
                {stockTickers.map((ticker) => (
                  <MenuItem key={ticker} value={ticker}>
                    {ticker}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
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
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              onClick={fetchCorrelationData}
              disabled={selectedStocks.length < 2 || loading}
              startIcon={<Calculate />}
              fullWidth
              size="large"
            >
              Analyze
            </Button>
          </Grid>
        </Grid>
        
        {selectedStocks.length < 2 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Please select at least 2 stocks to perform correlation analysis.
          </Alert>
        )}
        
        {selectedStocks.length > 8 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Maximum 8 stocks can be selected for optimal visualization.
          </Alert>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Calculating correlations...
            </Typography>
          </Box>
        </Box>
      ) : correlationData.length > 0 ? (
        <HeatmapChart
          data={correlationData}
          stocks={selectedStocks}
          loading={loading}
        />
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Configure your analysis settings and click "Analyze" to view correlations
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CorrelationPage;
