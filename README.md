Data Visualization Project

## Table of contents
* [Motivation](##Motivation)
* [Topic](##Topic)
* [Outcome](##Outcome)
* [Technologies](##Technologies)
* [Setup](##setup)
* [Methodology](##Methodology)
* [Project_Responsibilities](##Project_responsibilties)
* [Credits](##Credits)

## Motivation
This is a group project for the University Of Oregon Data Analytics Bootcamp. The purpose of this project is to learn how to tell a story through data visualization.

## Topic
The question we hope to be able to answer and show through data visualization: <br>
&nbsp; &nbsp; &nbsp; _How has State's "Shelter in Place" Ordinances affected Air Quality in US cities?_

## Outcome
This project group developed 2 interactive dashboards to show the effects of Covid-19 on the AQI (air quality index).  

* ![](/images/imagesREADME/ExampleChoropleth.gif)
    * A general AQI overview across the United States

* ![](/images/imagesREADME/ExampleDashboard.gif)
    * The dashboard displays more indepth data for following cities: Milwaukee WI, Indianapolis IN, Boise ID, Detroit Michigan, New Orleans LA, Columbus OH, Seattle WA, Portland OR, Los Angeles CA and New York City NY.
    * Average AQI data for selected city (pre and post State Ordinance date), State ordinance date, Population
    * Bar chart illustrates the selected city's daily AQI
    * Line chart compares the selected city's AQI this year versus last year

## Technologies
The project is created with:
* Python===3.6
* Bootstrap===4.3.1
* D3.js===5.16.0
* Leaflet===1.3.4
* Flask==1.1.1
* Flask-Cors==3.0.8
* geojson==2.5.0
* jupyter-client==5.3.4
* jupyter-core==4.6.1
* jupyterlab==1.2.5
* jupyterlab-server==1.0.6
* pandas==1.0.0
* psycopg2==2.8.4
* SQLAlchemy==1.3.13
* echarts===4.6.0
* canvasjs

## Setup

1. Jupyter Notebook installation: (https://jupyter.org/install)
2. Pandas installation: pip install pandas or conda install pandas
3. Psycopg2 installation: pip install pyscopg2 or conda install pyscopg2
4. SQLAlchemy installation: pip install SQLAlchemy or conda install -c anaconda sqlalchemy pip installation: (https://docs.sqlalchemy.org/en/13/intro.html#install-via-pip) conda installtion: (https://anaconda.org/anaconda/sqlalchemy)
5. PostgreSQL installation:

    * To download PostgreSQL version 12.1 for Windows x86-64 users: (http://enterprisedb.com/downloads/postgres-postgresql-downloads)
    
    * To download Postgres/pgAdmin installation for MAC users: (https://oregon.bootcampcontent.com/Oregon_Coding_Bootcamp/UofO-POR-DATA-PT-12-2019-U-C/blob/master/04-Resources/PostgreSQL%20Installation/postgresinstallmac.md)

6. CORS downnload to enable cross-origin resource sharing: (https://enable-cors.org/server_flask.html)
7. Mapbox installation and access key: (https://account.mapbox.com/auth/signup/)


## Methodology

1.  Data gathering
    * We gathered daily air quality data on 10 specific US cities. 
    * Air quality data came from from US EPA: https://www.epa.gov/outdoor-air-quality-data/air-quality-index-daily-values-report
    * State Ordinance Data a New York Times Article: https://www.nytimes.com/interactive/2020/us/coronavirus-stay-at-home-order.html

2. Data munging
    * Find original csv files (example: aqiDailyBoise) and cleaned csv files (example: UpdatedBoise.csv) in Resources folder 
    * The majority of data cleaning was completed via pandas
    * Before running jupyter notebook file:
        1. Please make sure your PostgreSQL database is setup
        2. Create config.py to hide PostgreSQL password (if needed)
        2. Run each step of Jupyter Notebook file (CleanedAQIDATA.ipynb). Running the file without errors will generate 10 tables in PostgreSQL database for each city. 
    * * ![jupyter_notebook](/images/imagesREADME/jupyterNotebook.PNG "jupyter_notebook")

3. Data Storage
    * Utilized PostgreSQL database
    * ![database](/images/imagesREADME/PostgreSQL.PNG "database")

 4. Creating Flask App
    * Flask App converts the PostgreSQL database into an API via Python and leveraging sqlalchemy, flask & flask_cors libraries.
    * When running create_engine be sure to include your password if needed.
    * To activate the API via the Flask App, in the terminal execute the comand 'python app.py' and this will then launch the API and return the jsonified data into the idex.html.

5. Creating graphs using 3 javascript libraries (Leaflet, JSCanvas and ECharts)
    * To explore the interactive capabilities of Leaflet choropleth map (https://leafletjs.com/examples/choropleth/) 
    * To download javascript code sample to create dynamic multi series line chart (https://canvasjs.com/javascript-charts/dynamic-live-multi-series-chart/)
    * To review EChart Beijing inspired AQI chart (https://echarts.apache.org/examples/en/editor.html?c=line-aqi). &nbsp; &nbsp; Note: To make more impactful chart, we dicided to show a bar chart instead of a line due to lack of datapoints. 

6. Designing the look of the dashboard
    * Bootstrap powerful and interactive tool (https://www.layoutit.com/build) were used to build the bones of the html.
    * CSS and Bootstrap built in tools were used to create the simple and clean design of the websites. 

## Credits
@ DanielLove
@ NancyMathur
@ AngieOng 
@ ChadGielow
