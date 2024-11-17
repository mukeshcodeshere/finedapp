#!/bin/bash

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install backend dependencies
cd backend
pip install -r src/requirements.txt

# Install frontend dependencies
cd ../frontend
npm install

echo "Setup complete! Run ./start_dev.sh to start the application"