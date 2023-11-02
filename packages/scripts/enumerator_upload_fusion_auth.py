import requests
import csv
import json
from collections import defaultdict
from decouple import config



url = "https://user-service.staging.anamaya.samagra.io/api/signup"
headers = {'x-application-id': '', 
    'Content-Type': 'application/json'}

def upload_data(insertions):
    insert_fusion_auth_user_request = requests.post(
        url, headers=headers, json=insertions)
    print("Response: " + insert_fusion_auth_user_request.text)

with open("input/samples/enumerator/users.json", 'r') as file:
    users = json.load(file)
    for user_id, user_data in users.items():
        print("Adding user to Fusion Auth: " + user_id,user_data)
        upload_data(user_data)

