from flask import Flask, request, jsonify
from flask_cors import CORS
from database.connection import SessionLocal
from services.stock_service import fetch_and_store_stock_data
import os

app = Flask(__name__)
CORS(app)

@app.route('/fetch-stock', methods=['POST'])
def fetch_stock():
    ticker = request.json.get('ticker')
    db = SessionLocal()
    
    try:
        stock_data = fetch_and_store_stock_data(ticker, db)
        return jsonify({"message": "Stock data fetched and stored successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route('/get-stock-data', methods=['GET'])
def get_stock_data():
    ticker = request.args.get('ticker')
    db = SessionLocal()
    
    try:
        stock_data = db.query(StockPrice).filter(StockPrice.ticker == ticker).all()
        return jsonify([{
            'date': str(row.date),
            'open': row.open,
            'high': row.high,
            'low': row.low,
            'close': row.close,
            'volume': row.volume
        } for row in stock_data])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

if __name__ == '__main__':
    app.run(debug=True, port=5001)