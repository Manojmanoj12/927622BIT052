
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Card,
  CardContent,
} from '@mui/material';

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

interface HeatmapChartProps {
  data: CorrelationData[];
  stocks: string[];
  loading: boolean;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ data, stocks, loading }) => {
  // Create correlation matrix
  const createCorrelationMatrix = () => {
    const matrix: { [key: string]: { [key: string]: number } } = {};
    
    // Initialize matrix with 1s on diagonal
    stocks.forEach(stock => {
      matrix[stock] = {};
      stocks.forEach(otherStock => {
        matrix[stock][otherStock] = stock === otherStock ? 1 : 0;
      });
    });
    
    // Fill in correlation data
    data.forEach(item => {
      matrix[item.ticker1][item.ticker2] = item.correlation;
      matrix[item.ticker2][item.ticker1] = item.correlation; // Symmetric
    });
    
    return matrix;
  };

  const getColorForCorrelation = (correlation: number): string => {
    if (correlation >= 0.7) return '#4caf50'; // Strong positive - green
    if (correlation >= 0.3) return '#8bc34a'; // Moderate positive - light green
    if (correlation >= -0.3) return '#ffeb3b'; // Weak - yellow
    if (correlation >= -0.7) return '#ff9800'; // Moderate negative - orange
    return '#f44336'; // Strong negative - red
  };

  const getCorrelationLabel = (correlation: number): string => {
    if (correlation >= 0.7) return 'Strong Positive';
    if (correlation >= 0.3) return 'Moderate Positive';
    if (correlation >= -0.3) return 'Weak';
    if (correlation >= -0.7) return 'Moderate Negative';
    return 'Strong Negative';
  };

  const matrix = createCorrelationMatrix();

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Loading correlation data...</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Stock Correlation Heatmap
      </Typography>

      <Grid container spacing={3}>
        {/* Heatmap */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ overflowX: 'auto' }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: `120px repeat(${stocks.length}, 80px)`,
                gap: 1,
                minWidth: 120 + stocks.length * 80,
              }}
            >
              {/* Empty top-left corner */}
              <Box />
              
              {/* Column headers */}
              {stocks.map(stock => (
                <Box
                  key={stock}
                  sx={{
                    p: 1,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    transform: 'rotate(-45deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 60,
                  }}
                >
                  {stock}
                </Box>
              ))}
              
              {/* Matrix cells */}
              {stocks.map(rowStock => (
                <React.Fragment key={rowStock}>
                  {/* Row header */}
                  <Box
                    sx={{
                      p: 1,
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      pr: 2,
                    }}
                  >
                    {rowStock}
                  </Box>
                  
                  {/* Correlation cells */}
                  {stocks.map(colStock => {
                    const correlation = matrix[rowStock][colStock];
                    return (
                      <Box
                        key={`${rowStock}-${colStock}`}
                        sx={{
                          backgroundColor: getColorForCorrelation(correlation),
                          color: Math.abs(correlation) > 0.5 ? 'white' : 'black',
                          p: 1,
                          textAlign: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 0.8,
                            transform: 'scale(1.05)',
                          },
                          transition: 'all 0.2s',
                        }}
                        title={`${rowStock} vs ${colStock}: ${correlation.toFixed(3)} (${getCorrelationLabel(correlation)})`}
                      >
                        {correlation.toFixed(2)}
                      </Box>
                    );
                  })}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Legend and Stats */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Correlation Legend
            </Typography>
            {[
              { range: '0.7 to 1.0', label: 'Strong Positive', color: '#4caf50' },
              { range: '0.3 to 0.7', label: 'Moderate Positive', color: '#8bc34a' },
              { range: '-0.3 to 0.3', label: 'Weak', color: '#ffeb3b' },
              { range: '-0.7 to -0.3', label: 'Moderate Negative', color: '#ff9800' },
              { range: '-1.0 to -0.7', label: 'Strong Negative', color: '#f44336' },
            ].map(item => (
              <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: item.color,
                    mr: 2,
                    borderRadius: 1,
                  }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.range}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Stock Statistics */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Stock Statistics
          </Typography>
          {data.slice(0, 4).map(item => (
            <Card key={`${item.ticker1}-${item.ticker2}`} sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  {item.ticker1} vs {item.ticker2}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip
                    label={`${item.correlation >= 0 ? '+' : ''}${item.correlation.toFixed(3)}`}
                    color={item.correlation >= 0 ? 'success' : 'error'}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {getCorrelationLabel(item.correlation)}
                  </Typography>
                </Box>
                <Typography variant="caption" display="block">
                  {item.ticker1}: Avg ${item.stock1Data.averagePrice.toFixed(2)}, σ ${item.stock1Data.standardDeviation.toFixed(2)}
                </Typography>
                <Typography variant="caption" display="block">
                  {item.ticker2}: Avg ${item.stock2Data.averagePrice.toFixed(2)}, σ ${item.stock2Data.standardDeviation.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HeatmapChart;
