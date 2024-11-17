import yfinance as yf
import pandas as pd
from sqlalchemy.orm import Session
from database.connection import StockPrice

def fetch_and_store_stock_data(ticker: str, db: Session):
    # Fetch 1-year historical data
    stock_data = yf.download(ticker, period="1y")
    
    # Reset index to make date a column
    stock_data.reset_index(inplace=True)
    
    # Prepare data for database insertion
    stock_prices = []
    for _, row in stock_data.iterrows():
        stock_price = StockPrice(
            date=row['Date'],
            ticker=ticker,
            open=row['Open'],
            high=row['High'],
            low=row['Low'],
            close=row['Close'],
            volume=row['Volume']
        )
        stock_prices.append(stock_price)
    
    # Clear existing data for the ticker
    db.query(StockPrice).filter(StockPrice.ticker == ticker).delete()
    
    # Bulk insert new data
    db.add_all(stock_prices)
    db.commit()
    
    return stock_prices