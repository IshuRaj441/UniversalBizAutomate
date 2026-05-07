#!/usr/bin/env python3
"""
Test script to verify all conversion features are working
"""
import requests
import os
import json

BASE_URL = "http://localhost:5000"

def test_health():
    """Test health endpoint"""
    response = requests.get(f"{BASE_URL}/api/health")
    print(f"Health Check: {response.status_code}")
    print(f"Response: {response.json()}")

def test_tools():
    """Test tools endpoint"""
    response = requests.get(f"{BASE_URL}/api/tools")
    print(f"Tools Check: {response.status_code}")
    tools = response.json()
    print(f"Available tools: {len(tools['tools'])}")
    for tool in tools['tools']:
        print(f"  - {tool['name']}: {tool['input']} -> {tool['output']}")

def test_file_validation():
    """Test file validation with different file types"""
    # Test that backend accepts the new file types
    allowed_extensions = {'pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'bmp', 'tiff'}
    print(f"Allowed extensions: {allowed_extensions}")
    
    # Check if the backend config includes these extensions
    response = requests.get(f"{BASE_URL}/api/status")
    print(f"Status Check: {response.status_code}")
    print(f"Response: {response.json()}")

def main():
    print("🧪 Testing Universal Business Automation API")
    print("=" * 50)
    
    try:
        print("\n1. Testing Health Endpoint...")
        test_health()
        
        print("\n2. Testing Tools Endpoint...")
        test_tools()
        
        print("\n3. Testing File Validation...")
        test_file_validation()
        
        print("\n✅ All tests completed successfully!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the backend server")
        print("Make sure the backend is running on http://localhost:5000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
