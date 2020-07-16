d3.select("#selDataset").on("change", updateGraphs);

// Formats Date
function formatDate(nowDate) {
    nowDate = (nowDate.getMonth() + 1) +'/'+ (nowDate.getDate() + 1) +"/"+ nowDate.getFullYear();
    return nowDate;
}

// Calculates the mean
function mean(numbers) {
    var total = 0, i;
    for (i = 0; i < numbers.length; i += 1) {
        total += numbers[i];
    }
    return total / numbers.length;
}

// Adds commas to large numbers
function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// Calculates and produces statiscal data
function getSummary() {

    // Pull data from Flask url
    var state = d3.select("#selDataset").node().value;
    var url="http://127.0.0.1:5000/api/v1.0/"+ state;
    
    // Use D3 fetch to read the JSON file
    d3.json(url).then(function (data) {
        // console.log(data)
        var shelterDate = formatDate(new Date(data[0].state_ordinance));
        var cityPopulation = numberWithCommas(data[0].population);
        
        //  PRE and POST shelter-in-place data for the city
        var postShelter = data.filter(elementData => new Date(elementData.date) >= new Date(shelterDate));
        var preShelter = data.filter(elementData => new Date(elementData.date) < new Date(shelterDate));
        
        // PRE and POST shelter-in=place date
        var aqiPostAvg = mean(postShelter.map(aqidata => aqidata.aqi_value));
        var aqiPreAvg = mean(preShelter.map(aqidata => aqidata.aqi_value));
        var aqiPostAvgRounded = Math.round(aqiPostAvg,2);
        var aqiPreAvgRounded = Math.round(aqiPreAvg,2);
        
        // Select and input statiscal data
        document.getElementById("pre").innerHTML = aqiPreAvgRounded;
        document.getElementById("post").innerHTML = aqiPostAvgRounded;
        document.getElementById("shelterDate").innerHTML = shelterDate;
        document.getElementById("population").innerHTML = cityPopulation;

        if (round_meanAqiPre >= 50) {
            document.getElementById("dataL").style["background-color"] = "#f5bd1f";
        }   else {
                document.getElementById("dataL").style["background-color"] = "#006600";
        }
        if (round_meanAqiPost >= 50) {
            document.getElementById("dataML").style["background-color"] = "#f5bd1f";
        }   else {
                document.getElementById("dataML").style["background-color"] = "#006600";
        }
    })
}

function getPlot() {

    // Pull data from Flask url
    var state = d3.select("#selDataset").node().value;
    var url="http://127.0.0.1:5000/api/v1.0/"+ state;
    
    // Use D3 fetch to read the JSON file
    d3.json(url).then(function (info) {
        
        //  2019 and 2020 AQI Comparison Data
        var data2020 = info.filter(elementData => new Date(elementData.date) >= new Date("February 29, 2020"));
        
        // Pull data for graph title
        var cityName = data2020[0].city_name.replace("_", " ");
        var shelterDate = new Date(data2020[0].state_ordinance);
        var aqiShelter = data2020[(shelterDate.getDate())].aqi_value;
        
        // Create chart
        var chart = document.getElementById('chart');
        var myChart = echarts.init(chart);
        var option = {
            title: { 
                    text: `${cityName} Daily AQI`, 
                    textStyle: {
                        fontSize: 30,
                        fontFamily: "ariel"
                    },
                    x: "center"
            },
            tooltip: { 
                    trigger: 'axis'
            },
            xAxis: { 
                axisLabel: {
                    show: true,   
                    interval: 5,
                    rotate: 45                        
                },
                data: data2020.map(function (i) {
                    var displayDate = new Date(i.date).toISOString().slice(5,10);
                    return displayDate;
                })
                
            },          
            yAxis: { 
                type: 'value',
                name: 'AQI Value',
                nameLocation:'middle',
                nameGap: 30
            },
            visualMap: {
                top: -5,
                right: -5,
                pieces: [{
                    gt: 0,
                    lte: 50,
                    color: '#006600'
                }, {
                    gt: 50,
                    lte: 100,
                    color: '#f5bd1f'
                }, {
                    gt: 100,
                    lte: 150,
                    color: '#ff4500'
                // }, {
                //     gt: 150,
                //     lte: 200,
                //     color: '#cc0033'
                // }, {
                //     gt: 200,
                //     lte: 300,
                //     color: '#660099'
                // }, {
                //     gt: 300,
                //     color: '#7e0023'
                }],
                outOfRange: {
                    color: '#999'
                }
            },
            dataZoom: [{                    // AO this controls accordian line
                startValue: '2020-01-01'    // at the bottom
            }, {
                type: 'inside'
            }],
            series: {
                name: `${cityName} AQI`,
                type: 'bar',
                data: data2020.map(function (i) {
                    return i.aqi_value}),   
                markPoint: {
                    data: [{  //value: `Ordinance Date: ${formatDate(shelterDate)}`, 
                    xAxis: (shelterDate.getDate()), yAxis: (aqiShelter)}],
                    symbol: 'pin',
                    symbolSize: 40,
                    label:{
                        fontSize: 16,
                        fontStyle: "bold",
                        color: "black",
                        offset: [10, -10]
                    }
                    },
                markLine: {
                    silent: true,
                    data: [{
                        yAxis: 50
                    }, {
                        yAxis: 100
                    }, {
                        yAxis: 150
                    }, {
                        yAxis: 200
                    }, {
                        yAxis: 300
                    }],
                }
            }, 
        };
        myChart.setOption(option);
    })
}

function getSpline() {

    // Pull data from Flask url
    var state = d3.select("#selDataset").node().value;
    var url="http://127.0.0.1:5000/api/v1.0/"+ state;
    
    // Use D3 fetch to read the JSON file
    d3.json(url).then((info) => {
   
        // console.log(info);
        
        // Pull city name for graph title
        var cityName = info[0].city_name.replace("_", " ")
       
        var dps2020 = [];
        var dps2019 = [];
        var chart = new CanvasJS.Chart("chartContainer", {
            exportEnabled: false,
            title :{
                text: `${cityName} 2019 vs. 2020`,
                fontFamily: "ariel",
                fontSize: 30,
                fontWeight: "bold"
            },
            axisY: {
                includeZero: false,
                title: "AQI Value",
            },
            axisX:{
                valueFormatString: "MM-DD",
                labelAngle: 130
            },
            toolTip:{
                reversed: true,
                shared: true
            },
            data: [{
                type: "spline",
                showInLegend: true,
                name: "2019",
                markerSize: 0,
                dataPoints: dps2019,
                color:"#696969" 
            },{
                type: "spline",
                showInLegend: true,
                name: "2020",
                markerSize: 5,
                dataPoints: dps2020,
                color: "rgb(179,33,37)"
            }]
        });

        //  2019 and 2020 AQI Comparison Data
        var data2020 = info.filter(elementData => new Date(elementData.date) >= new Date("February 29, 2020"));
        var recentDate = new Date(data2020[data2020.length-1].date);
        var yearPrior = recentDate.setMonth(recentDate.getMonth() - 12);
        var data2019 = info.filter(elementData => new Date(elementData.date) >= new Date("February 28, 2019") && new Date(elementData.date) <= (yearPrior));
        
        var val = 0, val2 = 0, val3 = 0;
        var updateInterval = 250;
        var dataLength = 5;  // number of dataPoints visible at any point
        
        var updateChart = function (count) {
            count =  count || 1;     // count is number of times loop runs to generate random dataPoints.
           
            if (val3 > (data2020.length - dataLength)){
                return;
            }
            val3++;

            for (var j = 0; j < count; j++) {	
                var xVal = new Date(data2020[val].date);
                var yVal = data2020[val].aqi_value;
                dps2020.push({
                    x: xVal,
                    y: yVal
                });
                val++;
            }
            for (var j = 0; j < count; j++) {	
                var xVal2 = new Date(data2020[val2].date);
                var yVal2 = data2019[val2].aqi_value;
                dps2019.push({
                    x: xVal2,
                    y: yVal2
                });
                val2++;
            }  
            chart.render()                
        };  
        updateChart(dataLength); 
        setInterval(function(){ updateChart() }, updateInterval);       
    })
}

function updateGraphs() {
    getSummary();
    getPlot();
    getSpline();
}

updateGraphs();