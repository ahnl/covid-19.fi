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
            document.getElementById(this.chart.canvas.dataset.chartTooltip).style.display = 'block';

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
var c2= document.getElementById('canvas2');
var ctx = c1.getContext('2d');
var ctx2 = c2.getContext('2d');
var graphTooltip1 = document.getElementById('graphTooltip1');
var graphTooltip2 = document.getElementById('graphTooltip2');


function clearTooltips() {
    graphTooltip1.style.display = 'none';
    graphTooltip2.style.display = 'none';
   };

c1.onmouseleave = clearTooltips;
c1.ontouchleave = clearTooltips;
c2.onmouseleave = clearTooltips;
c2.ontouchleave = clearTooltips;

function getLastUpdated() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.github.com/repos/ahnl/coronavirus-finland/commits?path=total.csv&page=1&per_page=1', true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        document.getElementById('lastUpdated').innerHTML = 'Tilastot päivitetty viimeeksi ' + timeago.format(new Date(xhr.response[0].commit.author.date), 'fi');
      }
    };
    xhr.send();
}
getLastUpdated();

function dataFromCsv(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
          var rows = xhr.response.trim().split('\n');
          var data = {labels: [], data: []};
          for (var i = 0; i < rows.length; i++) {
            try {
                var row = rows[i].split(',');
                var date = new Date(row[0]);
                var cleanDate = date.getDate() + '.' + (date.getMonth() + 1) + '.';
                data.labels.push(cleanDate);
                data.data.push(row[1]);
            }  catch (e) {
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
dataFromCsv('https://raw.githubusercontent.com/ahnl/coronavirus-finland/master/day.csv', function(err, data) {
    if (!err) {
        makeChart(ctx, 'Tapaukset', data);
    }    
});

dataFromCsv('https://raw.githubusercontent.com/ahnl/coronavirus-finland/master/total.csv', function(err, data) {
    if (!err) {
        document.getElementById('total').innerHTML = data.data[data.data.length - 1];
        makeChart(ctx2, 'Tartunnat yhteensä', data);
    }    
});