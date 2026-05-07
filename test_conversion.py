#!/usr/bin/env python3
"""
Test script to verify file conversion and download
"""
import requests
import os

# Test conversion
API_URL = "http://localhost:5000/api"

def test_conversion():
    # Create a simple test PDF file
    test_file_path = "test.pdf"
    
    # Check if test file exists
    if not os.path.exists(test_file_path):
        print("Test file not found. Creating a simple test file...")
        # For testing, you'll need to provide a test PDF file
        return False
    
    # Upload and convert
    with open(test_file_path, 'rb') as f:
        files = {'file': (test_file_path, f, 'application/pdf')}
        data = {'action': 'pdf_to_word'}
        
        try:
            response = requests.post(f"{API_URL}/convert", files=files, data=data)
            print(f"Conversion response: {response.status_code}")
            print(f"Response data: {response.json()}")
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success'):
                    download_url = result.get('download_url')
                    print(f"Download URL: {download_url}")
                    
                    # Test download
                    download_response = requests.get(f"http://localhost:5000{download_url}")
                    print(f"Download response: {download_response.status_code}")
                    
                    if download_response.status_code == 200:
                        print("✅ SUCCESS: File conversion and download working!")
                        return True
                    else:
                        print(f"❌ FAILED: Download failed - {download_response.text}")
                        return False
                else:
                    print(f"❌ FAILED: Conversion failed - {result.get('error')}")
                    return False
            else:
                print(f"❌ FAILED: API error - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ ERROR: {e}")
            return False

if __name__ == "__main__":
    print("Testing file conversion and download...")
    test_conversion()
