import json
import names

# Path to your JSON file
file_path = r'C:\Users\shimu\lineupx\src\api\data\Users.json'

# Open and read the JSON file
with open(file_path, 'r') as file:
    data = json.load(file)

# Modify each entry
for index, entry in enumerate(data, start=1):  # Assuming 'data' is a list of dictionaries
    entry['password'] = "f{1}"
    entry['email'] = f"{index}@gmail.com"
    entry['username'] = names.get_full_name()

# Write the modified data back to the file
with open(file_path, 'w') as file:
    json.dump(data, file, indent=4)