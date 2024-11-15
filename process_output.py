import json

# Read the JSON file
with open("output.json", "r") as f:
    data = json.load(f)

print("Stadium Data:", data)