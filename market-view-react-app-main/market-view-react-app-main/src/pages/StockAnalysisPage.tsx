
import React, { useState, useEffect } from 'react';
import { Box, Alert, CircularProgress, Typography } from '@mui/material';
import StockSelector from '../components/StockAnalysis/StockSelector';
import StockChart from '../components/StockAnalysis/StockChart';
import { stockApi, StockData } from '../services/stockApi';

interface StockAnalysisPageProps {
  availableStocks: Record<string, string>;
}

const StockAnalysisPage: React.FC<StockAnalysisPageProps> = ({ availableStocks }) => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [timeRange, setTimeRange] = useState(30);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockData = async () => {
    if (!selectedStock) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await stockApi.getStockData(selectedStock, timeRange);
      
      // Add timestamp for chart display
      const dataWithTimestamp = {
        ...data,
        priceHistory: data.priceHistory.map(point => ({
          ...point,
          timestamp: new Date(point.lastUpdatedAt).getTime(),
        })),
      };
      
      setStockData(dataWithTimestamp);
    } catch (err) {
      setError('Failed to fetch stock data. Please try again.');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(availableStocks).length > 0) {
      fetchStockData();
    }
  }, [selectedStock, timeRange, availableStocks]);

  useEffect(() => {
    // Set default stock if available
    if (Object.keys(availableStocks).length > 0 && !selectedStock) {
      const firstStock = Object.values(availableStocks)[0];
      setSelectedStock(firstStock);
    }
  }, [availableStocks, selectedStock]);

  return (
    <Box>
      <StockSelector
        selectedStock={selectedStock}
        onStockChange={setSelectedStock}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        availableStocks={availableStocks}
        loading={loading}
      />

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
              Loading stock data...
            </Typography>
          </Box>
        </Box>
      ) : stockData ? (
        <StockChart
          data={stockData.priceHistory}
          averagePrice={stockData.averageStockPrice}
          ticker={selectedStock}
          timeRange={timeRange}
        />
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Select a stock to view its price analysis
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default StockAnalysisPage;
