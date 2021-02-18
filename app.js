var cvfGraphOptions = {
    layout: {
        padding: {
            bottom: -20,
            left: -20,
            top: 50
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        enabled: false,
        intersect: false,
        custom: function (model) {
            document.getElementById(this._chart.canvas.dataset.chartTooltip).innerHTML = model.title + '<br>' + numberWithSpaces(model.dataPoints[0].yLabel) + ' tartuntaa';
        }
    },
    hover: {
        mode: 'index',
        intersect: false
    },
    scales: {

        yAxes: [{
            gridLines: {
                display: false
            },
            ticks: {
                display: false
            }
        }],
        xAxes: [{
            gridLines: {
                display: false
            },
            ticks: {
                display: false
            }
        }]
    },
    elements: {
        point: {
            radius: 0
        }
    },
    legend: {
        display: false
    }

};

Chart.defaults.LineWithLine = Chart.defaults.line;
Chart.controllers.LineWithLine = Chart.controllers.line.extend({
    draw: function (ease) {
        Chart.controllers.line.prototype.draw.call(this, ease);

        if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
            var activePoint = this.chart.tooltip._active[0],
                ctx = this.chart.ctx,
                x = activePoint.tooltipPosition().x,
                topY = this.chart.scales['y-axis-0'].top - 50,
                bottomY = this.chart.scales['y-axis-0'].bottom;

            //console.log(this.chart.canvas);
            document.getElementById(this.chart.canvas.dataset.chartTooltip).classList.remove('animated', 'fadeOutDown');
            document.getElementById(this.chart.canvas.dataset.chartTooltip).style.display = 'block';
            document.getElementById(this.chart.canvas.dataset.chartTooltip).classList.add('animated', 'fadeInUp');

            // draw line
            ctx.save();
            ctx.beginPath();
            ctx.setLineDash([2]);
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 2;

            ctx.strokeStyle = '#2D5520';
            ctx.stroke();
            ctx.restore();

        }
    }
});


var c1 = document.getElementById('canvas1');
var c2 = document.getElementById('canvas2');
var ctx = c1.getContext('2d');
var ctx2 = c2.getContext('2d');
var graphTooltip1 = document.getElementById('graphTooltip1');
var graphTooltip2 = document.getElementById('graphTooltip2');


function clearTooltips() {
    graphTooltip1.classList.remove('animated', 'fadeInUp');
    graphTooltip2.classList.remove('animated', 'fadeInUp');
    graphTooltip1.classList.add('animated', 'fadeOutDown');
    graphTooltip2.classList.add('animated', 'fadeOutDown');
};

c1.onmouseleave = clearTooltips;
c1.ontouchleave = clearTooltips;
c2.onmouseleave = clearTooltips;
c2.ontouchleave = clearTooltips;
function getLastUpdated() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.github.com/repos/ahnl/coronavirus-finland/commits?path=data/regional.csv&page=1&per_page=1', true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            document.getElementById('lastUpdated').innerHTML = 'Tilastot päivitetty viimeeksi ' + timeago.format(new Date(xhr.response[0].commit.author.date), 'fi');
        }
    };
    xhr.send();
}
getLastUpdated();

function dataFromCsv(url, type, columnShift, callback) {
    // type = false : chart dataset and clean dates
    // type = true  : object
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            var rows = xhr.response.trim().split('\n');
            if (type) {
                var data = {
                    labels: [],
                    data: []
                };
            } else {
                var data = {};
            }

            for (var i = 0; i < rows.length; i++) {
                try {
                    if (rows[i].includes(',')) {
                        var row = rows[i].split(',');
                    } else {
                        var row = rows[i].split(';');
                    }
                    if (type) {
                        var date = new Date(row[0 + columnShift]);
                        var cleanDate = date.getDate() + '.' + (date.getMonth() + 1) + '.';
                        data.labels.push(cleanDate);
                        data.data.push(row[1 + columnShift]);

                    } else {
                        data[row[0 + columnShift]] = row[1 + columnShift];

                    }



                } catch (e) {
                    console.log('dataFromCsv invalid row ' + i)
                }
            }
            callback(null, data);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
}


var eastereggCounter = 0;

function eastereggClick() {
    eastereggCounter += 1;



    if (eastereggCounter == 10) {
        document.body.classList.add('rainbowBackground');
        document.getElementById("eastereggSound").play();
    }
}

var tabSelector = document.getElementById('tabSelector');
var tabA = document.getElementById('tabA');
var tabB = document.getElementById('tabB');
var tabContentA = document.getElementById('tabContentA');
var tabContentB = document.getElementById('tabContentB');

tabContentA.addEventListener('animationend', removeTabAnimations);
tabContentB.addEventListener('animationend', removeTabAnimations);

function removeTabAnimations() {
    tabContentA.classList.remove('animated', 'bounce');
    tabContentB.classList.remove('animated', 'bounce');
}

function toggleTab() {

    tabContentA.classList.add('animated', 'bounce');
    tabContentB.classList.add('animated', 'bounce');
    if (tabSelector.dataset.selected == 'A') {
        tabSelector.dataset.selected = 'B';
        tabSelector.style.left = '50%';
        tabA.classList.remove('selectedTab');
        tabB.classList.add('selectedTab');

        tabContentA.style.display = 'none';
        tabContentB.style.display = 'block';


    } else {
        tabSelector.dataset.selected = 'A';
        tabSelector.style.left = '0';
        tabB.classList.remove('selectedTab');
        tabA.classList.add('selectedTab');

        tabContentB.style.display = 'none';
        tabContentA.style.display = 'block';

    }
}

// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeColor(color, percent) {

    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}


var regionNames = {
    'uusimaa': 'Uusimaa',
    'varsinais-suomi': 'Varsinais-Suomi',
    'etela-karjala': 'Etelä-Karjala',
    'lappi': 'Lappi',
    'pohjois-pohjanmaa': 'Pohjois-Pohjanmaa',
    'kainuu': 'Kainuu',
    'pohjois-karjala': 'Pohjois-Karjala',
    'etela-savo': 'Etelä-Savo',
    'pohjois-savo': 'Pohjois-Savo',
    'kanta-hame': 'Kanta-Häme',
    'paijat-hame': 'Päijät-Häme',
    'ahvenanmaa': 'Ahvenanmaa',
    'etela-pohjanmaa': 'Etelä-Pohjanmaa',
    'keski-pohjanmaa': 'Keski-Pohjanmaa',
    'keski-suomi': 'Keski-Suomi',
    'pirkanmaa': 'Pirkanmaa',
    'satakunta': 'Satakunta',
    'kymenlaakso': 'Kymenlaakso',
    'pohjanmaa': 'Pohjanmaa'
};


document.getElementById('mapTooltipValue').addEventListener('animationend', function () {
    document.getElementById('mapTooltipValue').classList.remove('animated', 'fadeInUp');
    document.getElementById('mapTooltipArea').classList.remove('animated', 'fadeInUp');
});

function mapAreaTooltipAnimations() {
    document.getElementById('mapTooltipValue').classList.add('animated', 'fadeInUp');
    document.getElementById('mapTooltipArea').classList.add('animated', 'fadeInUp');
}

function mapArea(property) {

    if (document.getElementById('mapTooltipArea').innerHTML != regionNames[property]) {
        mapAreaTooltipAnimations();
    }
    document.getElementById('mapTooltipValue').innerHTML = numberWithSpaces(regionData[property]) + ' tartuntaa';
    document.getElementById('mapTooltipArea').innerHTML = regionNames[property];

    for (var regionName in regionNames) {
        if (regionNames.hasOwnProperty(regionName)) {
            if (document.getElementById('smap_' + regionName).getAttribute('fill') != undefined) {
                document.getElementById('smap_' + regionName).style.opacity = '0.5';

            }
        }
    }
    document.getElementById('smap_' + property).style.opacity = '1';
}

document.getElementById('mapSvgContainer').onmouseout = function () {
    for (var regionName in regionNames) {
        if (regionNames.hasOwnProperty(regionName)) {
            document.getElementById('smap_' + regionName).style.opacity = '1';
        }
    }
    if (document.getElementById('mapTooltipArea').innerHTML != 'Koko suomi') {
        mapAreaTooltipAnimations();
    }
    document.getElementById('mapTooltipValue').innerHTML = numberWithSpaces(total) + ' tartuntaa';

    document.getElementById('mapTooltipArea').innerHTML = 'Koko suomi';
};

function makeChart(canvasContext, label, data) {
    new Chart(canvasContext, {
        type: 'LineWithLine',
        data: {
            labels: data.labels,
            datasets: [{
                label: label,
                data: data.data,
                borderColor: '#2D5520',
                fill: true,
                backgroundColor: '#2D5520'
            }]
        },
        options: cvfGraphOptions
    });
}

var regionData = {};

function formatRegionData(data) {
    const conversions = {
        'ahvenanmaa': ['Ahvenanmaa'],
        'varsinais-suomi': ['Varsinais-Suomen SHP'],
        'uusimaa': ['Helsingin ja Uudenmaan SHP'],
        'etela-karjala': ['Etelä-Karjalan SHP'],
        'kanta-hame': ['Kanta-Hämeen SHP'],
        'satakunta': ['Satakunnan SHP'],
        'etela-pohjanmaa': ['Etelä-Pohjanmaan SHP'],
        'keski-suomi': ['Keski-Suomen SHP'],
        'pohjois-savo': ['Pohjois-Savon SHP'], 
        'pohjois-karjala': ['Pohjois-Karjalan SHP'],
        'pirkanmaa': ['Pirkanmaan SHP'],
        'lappi': ['Lapin SHP', 'Länsi-Pohjan SHP'],
        'pohjois-pohjanmaa': ['Pohjois-Pohjanmaan SHP'],
        'keski-pohjanmaa': ['Keski-Pohjanmaan SHP'],
        'pohjanmaa': ['Vaasan SHP'],
        'etela-savo': ['Etelä-Savon SHP', 'Itä-Savon SHP'],
        'paijat-hame': ['Päijät-Hämeen SHP'],
        'kymenlaakso': ['Kymenlaakson SHP'],
        'kainuu': ['Kainuun SHP']
    }    

    let newData = {};
    for (let shp in data) {
        let maakunta = Object.keys(conversions).find(p => conversions[p].includes(shp));
        if (maakunta) {
            if (newData[maakunta] == undefined) {
                newData[maakunta] = 0;
            }
            newData[maakunta] += parseInt(data[shp]);
        } else {
            console.log('Unknown shp: ' + shp);
        }
    }
    console.log(newData);
    return newData;
}
function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
dataFromCsv('https://raw.githubusercontent.com/ahnl/coronavirus-finland/master/data/regional.csv', false, 0, function (err, data) {
    if (!err) {
        //data
        data = formatRegionData(data);
        regionData = data;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://raw.githubusercontent.com/ahnl/coronavirus-finland/master/suomi.svg', true);
        xhr.onload = function () {
            var status = xhr.status;
            if (status === 200) {
                document.getElementById('mapSvgContainer').innerHTML = xhr.response;
                for (var property in regionData) {
                    if (regionData.hasOwnProperty(property)) {

                        var shade = -(0.04 * regionData[property]);
                        if (shade < -50) {
                            shade = -50;
                        }

                        console.log(property + ' ' + shade + ' ' + regionData[property]);

                        document.getElementById('smap_' + property).setAttribute("fill", shadeColor('#2D5520', shade)); // smap_

                        document.getElementById('smap_' + property).setAttribute('onmousemove', 'mapArea(\'' + property + '\')')
                    }
                }


            }
        };
        xhr.send();

    }
});

function makeCumulative(data) {
    // data = {data: , labels: }
    let cumData = {data: [], labels: []};
    let current = 0;
    data.labels.forEach((point, index) => {
        let value = parseInt(data.data[index]);
        current += (value ? value : 0);
        //console.log(point, current);
        cumData.labels.push(point);
        cumData.data.push(current);
    });

    return cumData;
}
function trimData(data) {
    function trimmer(i) {
        let value = parseInt(data.data[i]);
        value = (value ? value : 0);
        if (value > 0) {
            return true;
        } else {
            delete data.labels[i];
            delete data.data[i];
            return false;
        }
    }   
    for (let i = 0; i < data.labels.length; i++) {
        if (trimmer(i)) break
    }
    for (let i = data.labels.length; i--;) {
        if (trimmer(i)) break
    }
    return data;
}
function reindexData(data) {
    let newData = {data: [], labels: []};
    data.labels.forEach((point, index) => {
        let value = parseInt(data.data[index]);
        value = (value ? value : 0);
        newData.labels.push(point);
        newData.data.push(value);
    });
    return newData;
}
var total = null;

dataFromCsv('https://raw.githubusercontent.com/ahnl/coronavirus-finland/master/data/daily.csv', true, 1, function (err, data) {
    if (!err) {
        delete data.labels[0];
        delete data.data[0];
        data = trimData(data);
        data = reindexData(data);
        console.log(data);
        makeChart(ctx, 'Tapaukset', data);
        let cumData = makeCumulative(data);

        total = cumData.data[cumData.data.length - 1];

        document.getElementById('total').innerHTML = numberWithSpaces(total);
        document.getElementById('mapTooltipValue').innerHTML = numberWithSpaces(total) + ' tartuntaa';
        makeChart(ctx2, 'Tartunnat yhteensä', cumData);
    }
});

/*
dataFromCsv('https://raw.githubusercontent.com/ahnl/coronavirus-finland/master/total.csv', true, function (err, data) {
    if (!err) {
        total = data.data[data.data.length - 1];

        document.getElementById('total').innerHTML = total;
        document.getElementById('mapTooltipValue').innerHTML = total + ' tartuntaa';
        makeChart(ctx2, 'Tartunnat yhteensä', data);
    }
});*/
