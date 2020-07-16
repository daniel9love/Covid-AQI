import numpy as np
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from flask_cors import CORS
from flask import request
from flask import render_template

from flask_cors import CORS
# from config import password

#################################################
# Database Setup
#################################################

engine = create_engine("postgresql://postgres:postgres@localhost:5432/Project2AQIupdated")
# engine = create_engine(f"postgresql://postgres:{password}@localhost:5432/Project2AQI")

conn = engine.connect()

Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Boise = Base.classes.boise
Columbus = Base.classes.columbus
Detroit = Base.classes.detroit
Milwaukee = Base.classes.milwaukee
La = Base.classes.la
Neworleans = Base.classes.neworleans
Ny = Base.classes.ny
Portland = Base.classes.portland
Seattle = Base.classes.seattle
Indianapolis = Base.classes.indianapolis


# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)

# Flask Routes
#################################################

# Route to render index.html
@app.route("/")
def home():
    # Return template and data
    return render_template("index.html")

@app.route("/api")
def welcome():
    """List all available aqi routes."""
    return (
        f"Welcome to the Air Quality Index Data!<br/>"
        f"Available Routes:<br/>"
        f"<a href='/api/v1.0/boise'>Boise - Air Quality Index data</a><br/>"
        f"<a href='/api/v1.0/columbus'> Columbus - Air Quality Index data</a><br/>"
        f"<a href='/api/v1.0/detroit'> Detroit - Air Quality Index data</a><br/>"
        f"<a href='/api/v1.0/milwaukee'> Milwaukee - Air Quality Index data</a><br/>"
        f"<a href='/api/v1.0/la'> Los Angeles - Air Quality Index data</a><br/>"
        f"<a href='/api/v1.0/neworleans'> New Orleans - Air Quality Index data</a><br/>"
        f"<a href='/api/v1.0/ny'> New York City - Air Quality Index data</a><br/>"
        f"<a href='/api/v1.0/portland'> Portland - Air Quality Index data</a><br/>"
        f"<a href='/api/v1.0/seattle'> Seattle - Air Quality Index data</a><br/>"
        f"<a href='/api/v1.0/indianapolis'> Indianapolis - Air Quality Index data</a><br/>"
    )

@app.route("/<city_name>")
def city(city_name):
    return render_template("dashboard.html", urlOne= city_name)

@app.route("/api/v1.0/<city>")
def get_city_info(city):
    # Create our session (link) from Python to the DB
    session = Session(engine)
    City = Base.classes[city]

    # Query City's data
    city_data = session.query(
        City.date,
        City.overall_aqi_value,
        City.main_pollutant,
        City.site_name,
        City.site_id,
        City.source_aqi, 
        # City.co,
        # City.ozone,
        # City.so2,
        # City.pm10,
        # City.pm25,
        # City.no2,
        City.lat,
        City.lon,
        City.city_name,
        City.state_ordinance,
        City.population).all()

    session.close()

    # Create a dictionary to hold City data
    city_aqi = []
    for date, overall_aqi_value, main_pollutant, site_name, site_id, source_aqi, lat, lon, city_name, state_ordinance, population in city_data:
        city_dict = {}
        city_dict["date"] = date
        city_dict["aqi_value"] = overall_aqi_value
        city_dict["main_pollutant"] = main_pollutant
        city_dict["site_name"] = site_name
        city_dict["site_id"] = site_id
        city_dict["source_aqi"] = source_aqi
        city_dict["lat"] = lat
        city_dict["lon"] = lon
        city_dict["city_name"] = city_name
        city_dict["state_ordinance"] = state_ordinance
        city_dict["population"] = population
        city_aqi.append(city_dict)

    return jsonify(city_aqi)

if __name__ == '__main__':
    app.run(debug=True)