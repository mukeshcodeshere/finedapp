import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const fetchStockData = async (ticker) => {
  try {
    // Fetch and store stock data
    await axios.post(`${API_BASE_URL}/fetch-stock`, { ticker });
    
    // Retrieve stored stock data
    const response = await axios.get(`${API_BASE_URL}/get-stock-data`, { 
      params: { ticker } 
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};