import React, { useState } from 'react';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

function App() {
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchStock = async () => {
    if (!ticker) {
      setError('Please enter a stock ticker');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, fetch and store the data
      const fetchResponse = await axios.post('http://localhost:5001/fetch_stock_data', {
        ticker: ticker.toUpperCase()
      });

      if (fetchResponse.data.status === 'error') {
        throw new Error(fetchResponse.data.message);
      }

      // Then retrieve the stored data
      const getResponse = await axios.get(`http://localhost:5001/get_stock_data`, {
        params: { ticker: ticker.toUpperCase() }
      });

      // Process the data
      const processedData = getResponse.data.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString(),
        close: parseFloat(item.close)
      }));

      setStockData(processedData);
    } catch (err) {
      setError(err.message || 'Error fetching stock data');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Stock Price Tracker</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
          <input 
            type="text" 
            value={ticker} 
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Enter Stock Ticker (e.g., AAPL)"
            style={{ 
              flex: 1,
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
          <button 
            onClick={handleFetchStock}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Loading...' : 'Fetch Stock Data'}
          </button>
        </div>

        {error && (
          <div style={{ 
            color: 'red', 
            padding: '10px', 
            backgroundColor: '#ffebee',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}
      </div>

      {stockData.length > 0 && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>{ticker} Stock Price History</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke="#2196F3" 
                name="Closing Price"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>

          <div style={{ marginTop: '2rem' }}>
            <h3>Latest Price: {formatCurrency(stockData[stockData.length - 1].close)}</h3>
            <p>Last Updated: {stockData[stockData.length - 1].date}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;