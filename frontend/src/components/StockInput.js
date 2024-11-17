import React, { useState } from 'react';
import { fetchStockData } from '../services/apiService';

function StockInput({ onStockDataReceived }) {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const stockData = await fetchStockData(ticker.toUpperCase());
      onStockDataReceived(stockData);
    } catch (error) {
      alert('Error fetching stock data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="Enter Stock Ticker"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Fetching...' : 'Get Stock Data'}
      </button>
    </form>
  );
}

export default StockInput;  