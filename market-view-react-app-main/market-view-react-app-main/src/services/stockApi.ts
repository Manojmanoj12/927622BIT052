
export interface StockData {
  averageStockPrice: number;
  priceHistory: Array<{
    price: number;
    lastUpdatedAt: string;
  }>;
}

export interface CorrelationResponse {
  correlation: number;
  stocks: {
    [ticker: string]: {
      averagePrice: number;
      priceHistory: Array<{
        price: number;
        lastUpdatedAt: string;
      }>;
    };
  };
}

export interface StocksListResponse {
  stocks: {
    [name: string]: string;
  };
}

const API_BASE_URL = 'http://localhost:3001'; // Backend API URL

export const stockApi = {
  async getStocks(): Promise<StocksListResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks`);
      if (!response.ok) {
        throw new Error('Failed to fetch stocks');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching stocks:', error);
      // Fallback data for demo purposes
      return {
        stocks: {
          "Apple Inc.": "AAPL",
          "Microsoft Corporation": "MSFT",
          "Nvidia Corporation": "NVDA",
          "Tesla, Inc.": "TSLA",
          "Amazon.com, Inc.": "AMZN",
          "Alphabet Inc. Class A": "GOOGL",
          "Meta Platforms, Inc.": "META",
          "PayPal Holdings, Inc.": "PYPL",
        }
      };
    }
  },

  async getStockData(ticker: string, minutes: number): Promise<StockData> {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/${ticker}?minutes=${minutes}&aggregation=average`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${ticker}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching stock data for ${ticker}:`, error);
      // Generate mock data for demo purposes
      return this.generateMockStockData(minutes);
    }
  },

  async getCorrelationData(ticker1: string, ticker2: string, minutes: number): Promise<CorrelationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/stockcorrelation?minutes=${minutes}&ticker=${ticker1}&ticker=${ticker2}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch correlation data for ${ticker1} and ${ticker2}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching correlation data:`, error);
      // Generate mock correlation data for demo purposes
      return this.generateMockCorrelationData(ticker1, ticker2, minutes);
    }
  },

  generateMockStockData(minutes: number): StockData {
    const priceHistory = [];
    const basePrice = 100 + Math.random() * 400;
    let currentPrice = basePrice;
    
    for (let i = 0; i < minutes; i += 5) {
      const change = (Math.random() - 0.5) * 20;
      currentPrice = Math.max(10, currentPrice + change);
      
      priceHistory.push({
        price: currentPrice,
        lastUpdatedAt: new Date(Date.now() - (minutes - i) * 60000).toISOString(),
      });
    }
    
    const averageStockPrice = priceHistory.reduce((sum, point) => sum + point.price, 0) / priceHistory.length;
    
    return {
      averageStockPrice,
      priceHistory,
    };
  },

  generateMockCorrelationData(ticker1: string, ticker2: string, minutes: number): CorrelationResponse {
    const correlation = (Math.random() - 0.5) * 2; // Random correlation between -1 and 1
    
    const stock1Data = this.generateMockStockData(minutes);
    const stock2Data = this.generateMockStockData(minutes);
    
    return {
      correlation,
      stocks: {
        [ticker1]: {
          averagePrice: stock1Data.averageStockPrice,
          priceHistory: stock1Data.priceHistory,
        },
        [ticker2]: {
          averagePrice: stock2Data.averageStockPrice,
          priceHistory: stock2Data.priceHistory,
        },
      },
    };
  },
};
