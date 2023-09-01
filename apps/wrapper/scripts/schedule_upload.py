import requests
import csv
from collections import defaultdict
from decouple import config
import json


url = config('HASURA_REST_API_URL')
headers = {"x-hasura-admin-secret": config('HASURA_ADMIN_SECRET'),
           "Content-Type": "application/json"}


def upload_data(insertions):
    requestBody = {
        "query": "mutation ($object: [assessment_schedule_insert_input!] = {}) {\n insert_assessment_schedule(objects: $object, on_conflict: { \n constraint: assessment_schedule_assessor_code_date_key, \n update_columns: [institute_id, date, updated_at] \n}\n) {\n        returning {\n          id\n           }\n      }\n    }",
        "variables": {
            "object": insertions
        }
    }
    insertAssessmentScheduleRequest = requests.post(
        url, headers=headers, json=requestBody)
    print("Response: " + insertAssessmentScheduleRequest.text)


insertionObjects = []

with open("input/scheduling/AssessmentSchedule.csv", 'r') as file:
    csvreader = csv.reader(file)
    for row in csvreader:
        print("Adding schedule for " +
          row[1] + " on "+row[2]+" by "+row[0])
        insertionObjects.append(
            {
                "institute_id": row[1],
                "date": row[2],
                "assessor_code": row[0]
            }
        )
        if len(insertionObjects) == 10:
            print("Uploading schedule")
            upload_data(insertionObjects)
            insertionObjects.clear()

if len(insertionObjects) > 0:
    upload_data(insertionObjects)
