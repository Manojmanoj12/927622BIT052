
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
} from '@mui/material';

interface PricePoint {
  price: number;
  lastUpdatedAt: string;
  timestamp: number;
}

interface StockChartProps {
  data: PricePoint[];
  averagePrice: number;
  ticker: string;
  timeRange: number;
}

const StockChart: React.FC<StockChartProps> = ({ data, averagePrice, ticker, timeRange }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTooltip = (value: any, name: string, props: any) => {
    if (name === 'price') {
      return [`$${value.toFixed(2)}`, 'Price'];
    }
    return [value, name];
  };

  const formatLabel = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const currentPrice = data.length > 0 ? data[data.length - 1].price : 0;
  const priceChange = data.length > 1 ? currentPrice - data[0].price : 0;
  const priceChangePercent = data.length > 1 ? (priceChange / data[0].price) * 100 : 0;

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {ticker} Stock Analysis
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Current Price
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                ${currentPrice.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Average Price
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                ${averagePrice.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Change
              </Typography>
              <Chip
                label={`${priceChange >= 0 ? '+' : ''}$${priceChange.toFixed(2)}`}
                color={priceChange >= 0 ? 'success' : 'error'}
                variant="filled"
                size="small"
              />
            </Box>
          </Grid>
          
          <Grid xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Change %
              </Typography>
              <Chip
                label={`${priceChangePercent >= 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%`}
                color={priceChangePercent >= 0 ? 'success' : 'error'}
                variant="outlined"
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ height: 400, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              stroke="#666"
              fontSize={12}
            />
            <YAxis
              domain={['dataMin - 10', 'dataMax + 10']}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              stroke="#666"
              fontSize={12}
            />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={formatLabel}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#1976d2"
              strokeWidth={2}
              dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#1976d2', strokeWidth: 2, fill: '#fff' }}
            />
            <ReferenceLine
              y={averagePrice}
              stroke="#dc004e"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ value: `Avg: $${averagePrice.toFixed(2)}`, position: 'right' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default StockChart;
