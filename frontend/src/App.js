import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState(null);

  const handleFetchStock = async () => {
    try {
      // Fetch stock data
      const fetchResponse = await axios.post('http://localhost:5000/fetch_stock_data', { ticker });
      
      // Retrieve stock data
      const dataResponse = await axios.get(`http://localhost:5000/get_stock_data?ticker=${ticker}`);
      
      setStockData(dataResponse.data);
      setError(null);
    } catch (err) {
      setError('Error fetching stock data');
      setStockData([]);
      console.error(err);
    }
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: 'auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Stock Price Tracker</h1>
      
      <div style={{ 
        display: 'flex', 
        marginBottom: '20px' 
      }}>
        <input 
          type="text" 
          value={ticker} 
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Enter Stock Ticker (e.g., AAPL, GOOGL)"
          style={{ 
            padding: '10px', 
            marginRight: '10px',
            flex: 1
          }}
        />
        <button 
          onClick={handleFetchStock}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Fetch Stock Data
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {stockData.length > 0 && (
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#8884d8" 
              name="Closing Price"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default App;