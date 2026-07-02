import sys
import os
import traceback

# Add project root directory to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.append(project_root)

try:
    from main import app
    print("[+] Successfully imported FastAPI app from main!")
except Exception as e:
    print("[-] Failed to import FastAPI app from main:")
    traceback.print_exc()
    raise e
