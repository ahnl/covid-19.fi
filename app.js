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
            document.getElementById(this._chart.canvas.dataset.chartTooltip).innerHTML = model.title + '<br>' + model.dataPoints[0].yLabel + ' tartuntaa';
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
    xhr.open('GET', 'https://api.github.com/repos/ahnl/coronavirus-finland/commits?path=total.csv&page=1&per_page=1', true);
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

function dataFromCsv(url, type, callback) {
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
                    var row = rows[i].split(',');

                    if (type) {
                        var date = new Date(row[0]);
                        var cleanDate = date.getDate() + '.' + (date.getMonth() + 1) + '.';
                        data.labels.push(cleanDate);
                        data.data.push(row[1]);

                    } else {
                        data[row[0]] = row[1];

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

var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100',
        width: '960',
        videoId: 'OR_7h5DaI-E'
    });
}

var eastereggCounter = 0;

function eastereggClick() {
    eastereggCounter += 1;


    if (eastereggCounter == 1) {
        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    }

    if (eastereggCounter == 10) {
        document.body.classList.add('rainbowBackground');
       player.playVideo();
        player.setVolume(20);
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
    document.getElementById('mapTooltipValue').innerHTML = regionData[property] + ' tartuntaa';
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
    document.getElementById('mapTooltipValue').innerHTML = total + ' tartuntaa';

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

dataFromCsv('https://raw.githubusercontent.com/ahnl/coronavirus-finland/master/regional.csv', false, function (err, data) {
    if (!err) {
        //data
        regionData = data;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://raw.githubusercontent.com/ahnl/coronavirus-finland/master/suomi.svg', true);
        xhr.onload = function () {
            var status = xhr.status;
            if (status === 200) {
                document.getElementById('mapSvgContainer').innerHTML = xhr.response;
                for (var property in regionData) {
                    if (regionData.hasOwnProperty(property)) {

                        var shade = -(2 * regionData[property]);
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

dataFromCsv('https://raw.githubusercontent.com/ahnl/coronavirus-finland/master/day.csv', true, function (err, data) {
    if (!err) {
        makeChart(ctx, 'Tapaukset', data);
    }
});

var total = null;

dataFromCsv('https://raw.githubusercontent.com/ahnl/coronavirus-finland/master/total.csv', true, function (err, data) {
    if (!err) {
        total = data.data[data.data.length - 1];

        document.getElementById('total').innerHTML = total;
        document.getElementById('mapTooltipValue').innerHTML = total + ' tartuntaa';
        makeChart(ctx2, 'Tartunnat yhteensä', data);
    }
});