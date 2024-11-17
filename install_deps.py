import os
import sys
import subprocess

def install_dependencies():
    dependencies = [
        'python-dotenv',
        'flask',
        'flask-cors',
        'sqlalchemy',
        'psycopg2-binary',
        'yfinance',
        'pandas'
    ]
    
    for dep in dependencies:
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', dep])
            print(f"Successfully installed {dep}")
        except subprocess.CalledProcessError:
            print(f"Failed to install {dep}")

if __name__ == '__main__':
    install_dependencies()