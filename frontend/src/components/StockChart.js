import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

function StockChart({ stockData }) {
  return (
    <LineChart width={800} height={400} data={stockData}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="close" stroke="#8884d8" />
    </LineChart>
  );
}

export default StockChart;