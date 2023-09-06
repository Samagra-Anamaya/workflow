import requests
import csv
from collections import defaultdict
from decouple import config
import json


url = config('REACT_APP_USER_SERVICE_URL')
headers = {"x-application-id": config('REACT_APP_APPLICATION_ID'),
           "Content-Type": "application/json"}

def get_data(row):
    user_response = requests.get(
        url+"searchUserByQuery?startRow=0&numberOfResults=1&queryString=(username:%20"+row[0]+")", headers=headers)
    user_response = user_response.json()
    print(row[0]+","+user_response['result']['users'][0]['id'])


with open("input/assessors/userMobileNumbers.csv", 'r') as file:
    csvreader = csv.reader(file)
    print("Getting users from Fusion Auth")
    for row in csvreader:
        get_data(row)

