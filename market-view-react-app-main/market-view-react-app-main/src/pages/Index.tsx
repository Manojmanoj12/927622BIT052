
import React, { useState, useEffect } from 'react';
import { Box, Alert, CircularProgress, Typography } from '@mui/material';
import AppLayout from '../components/Layout/AppLayout';
import StockAnalysisPage from './StockAnalysisPage';
import CorrelationPage from './CorrelationPage';
import { stockApi } from '../services/stockApi';

const Index = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [availableStocks, setAvailableStocks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const fetchAvailableStocks = async () => {
    try {
      setLoading(true);
      const response = await stockApi.getStocks();
      setAvailableStocks(response.stocks);
      setError(null);
    } catch (err) {
      setError('Failed to fetch available stocks. Using demo data.');
      console.error('Error fetching stocks:', err);
      // Use fallback data
      setAvailableStocks({
        "Apple Inc.": "AAPL",
        "Microsoft Corporation": "MSFT",
        "Nvidia Corporation": "NVDA",
        "Tesla, Inc.": "TSLA",
        "Amazon.com, Inc.": "AMZN",
        "Alphabet Inc. Class A": "GOOGL",
        "Meta Platforms, Inc.": "META",
        "PayPal Holdings, Inc.": "PYPL",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableStocks();
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Loading Stock Market Analytics...
        </Typography>
      </Box>
    );
  }

  return (
    <AppLayout currentTab={currentTab} onTabChange={handleTabChange}>
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {currentTab === 0 && (
        <StockAnalysisPage availableStocks={availableStocks} />
      )}
      
      {currentTab === 1 && (
        <CorrelationPage availableStocks={availableStocks} />
      )}
    </AppLayout>
  );
};

export default Index;
