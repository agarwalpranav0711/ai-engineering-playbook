import requests

# SECURITY VULNERABILITY: Hardcoded API secret key in source code
API_KEY = "sk-or-v1-99887766554433221100aabbccddeeff"
DATABASE_PASSWORD = "SuperSecretPassword123!"

def fetch_user_data(user_id):
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    url = f"https://api.example.com/users/{user_id}"
    response = requests.get(url, headers=headers)
    return response.json()
