from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import pandas as pd
from sqlalchemy import create_engine, Column, Float, String, Date
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Neon Postgres Connection
# Get connection string from environment
NEON_DATABASE_URL = os.getenv('NEON_DATABASE_URL')

# SQLAlchemy Setup
Base = declarative_base()
engine = create_engine(NEON_DATABASE_URL, echo=True)
Session = sessionmaker(bind=engine)

class StockPrice(Base):
    __tablename__ = 'stock_prices'
    
    date = Column(Date, primary_key=True)
    ticker = Column(String, primary_key=True)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    close = Column(Float)
    volume = Column(Float)

# Create tables if not exists
Base.metadata.create_all(engine)

@app.route('/fetch_stock_data', methods=['POST'])
def fetch_stock_data():
    # Get ticker from request
    data = request.json
    ticker = data.get('ticker', 'AAPL').upper()
    
    # Fetch 1 year of historical data
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)
    
    try:
        stock_data = yf.download(ticker, start=start_date, end=end_date)
        
        # Store data in Neon Postgres
        session = Session()
        
        # Remove existing data for this ticker
        session.query(StockPrice).filter_by(ticker=ticker).delete()
        
        # Insert new data
        for index, row in stock_data.iterrows():
            stock_entry = StockPrice(
                date=index.date(),
                ticker=ticker,
                open=row['Open'],
                high=row['High'],
                low=row['Low'],
                close=row['Close'],
                volume=row['Volume']
            )
            session.add(stock_entry)
        
        session.commit()
        session.close()
        
        return jsonify({
            "status": "success", 
            "rows_added": len(stock_data), 
            "ticker": ticker
        })
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/get_stock_data', methods=['GET'])
def get_stock_data():
    # Get ticker from query parameters
    ticker = request.args.get('ticker', 'AAPL').upper()
    
    session = Session()
    stock_data = session.query(StockPrice).filter_by(ticker=ticker).all()
    
    # Convert to list of dictionaries
    data = [{
        'date': str(entry.date),
        'open': entry.open,
        'high': entry.high,
        'low': entry.low,
        'close': entry.close,
        'volume': entry.volume
    } for entry in stock_data]
    
    session.close()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)