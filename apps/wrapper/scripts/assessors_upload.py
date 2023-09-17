import requests
import csv
from collections import defaultdict
from decouple import config

assessorCodeToPhone = {}
assessorPhoneToId = {}

# Assessor code <> Phone number
# columns needed: code, phonenumber
with open("input/assessors/CodePhonenumberMapping.csv", 'r') as file:
    csvreader = csv.reader(file)
    for row in csvreader:
        assessorCodeToPhone[row[0]] = row[1]


# Assessor Phone <> User ID
# columns needed: phone, userid
with open("input/assessors/PhonenumberUserIdMapping.csv", 'r') as file:
    csvreader = csv.reader(file)
    for row in csvreader:
        assessorPhoneToId[row[0]] = row[1]

url = config('HASURA_REST_API_URL')
headers = {"x-hasura-admin-secret": config('HASURA_ADMIN_SECRET'),
           "Content-Type": "application/json"}

for key, value in assessorCodeToPhone.items():
    accessorId = assessorPhoneToId.get(value)

    if not accessorId:
        raise Exception("No userId found for assessor code: " +
                        key + " and phonenumber: "+value)

    requestBody = {
        "query": "mutation ($object: [assessors_insert_input!] = {}) {\n      insert_assessors(objects: $object) {\n        returning {\n          code\n           }\n      }\n    }",
        "variables": {
            "object": {
                "code": key,
                "phonenumber": value,
                "user_id": accessorId
            }
        }
    }
    print("Inserting "+key+", "+value)
    insertUserRequest = requests.post(url, headers=headers, json=requestBody)
    print(insertUserRequest.content)