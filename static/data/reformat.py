import json

with open("CityData.json") as file:
    states = json.load(file)
    with open("us-states.json") as file:
        data = json.load(file)
        # print(states)
        info = data["features"]
        i = 0 
        for key, value in states.items():
            if (info[i]["id"] == key):
                info[i]["properties"] = value
                print(info[i]["properties"])
                # print(value)
                i = i + 1 
        with open('statesAQI.json', 'w') as file:
            json.dump(data, file, indent=2)