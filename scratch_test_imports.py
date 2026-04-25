import time
import os
import sys

def test_imports():
    modules = [
        'firebase_functions',
        'firebase_admin',
        'mangum',
        'fastapi',
        'passlib.context',
        'jwt',
        'dotenv'
    ]
    
    for mod in modules:
        start = time.time()
        try:
            __import__(mod)
            print(f"Import {mod}: {time.time()-start:.4f}s")
        except Exception as e:
            print(f"Failed {mod}: {e}")

    # Test main.py import
    sys.path.append(os.path.join(os.getcwd(), 'functions'))
    start = time.time()
    try:
        import main
        print(f"Import main: {time.time()-start:.4f}s")
    except Exception as e:
        print(f"Failed main: {e}")

if __name__ == "__main__":
    test_imports()
