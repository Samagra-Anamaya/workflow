import requests
import csv
from collections import defaultdict
from decouple import config
import json


url = config('REACT_APP_USER_SERVICE_URL')+"signup"
headers = {"x-application-id": config('REACT_APP_APPLICATION_ID'),
           "Content-Type": "application/json"}

def upload_data(insertions):
    requestBody = {
        "registration": {
            "applicationId": config('REACT_APP_APPLICATION_ID'),
            "usernameStatus": "ACTIVE",
            "roles": insertions['role']
        },
        "user": {
            "fullName": insertions['name'],
            "password": insertions['mobile'],
            "username": insertions['mobile'],
            "email": insertions['email']
        }
    }
    insert_fusion_auth_user_request = requests.post(
        url, headers=headers, json=requestBody)
    print("Response: " + insert_fusion_auth_user_request.text)


with open("input/assessors/fusionAuthMapping.csv", 'r') as file:
    csvreader = csv.reader(file)
    for row in csvreader:
        print("Adding user to Fusion Auth: " + row[0])
        insertionObjects = {
                "name": row[0],
                "email": row[2],
                "mobile": row[3],
                "role": [row[4]]
            }
        upload_data(insertionObjects)
        insertionObjects.clear()

