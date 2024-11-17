import React, { useState } from 'react';
import StockInput from './components/StockInput';
import StockChart from './components/StockChart';

function App() {
  const [stockData, setStockData] = useState(null);

  return (
    <div>
      <h1>Stock Price Tracker</h1>
      <StockInput onStockDataReceived={setStockData} />
      {stockData && <StockChart stockData={stockData} />}
    </div>
  );
}

export default App;