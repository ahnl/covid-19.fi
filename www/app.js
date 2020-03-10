

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
            //console.log(model.title + ': ' + model.dataPoints[0].yLabel);
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
var graphTooltip1 = document.getElementById('graphTooltip1');
var graphTooltip2 = document.getElementById('graphTooltip2');
var ctx = c1.getContext('2d');
var ctx2 = c2.getContext('2d');

function clearTooltips() {
    graphTooltip1.style.display = 'none';
    graphTooltip2.style.display = 'none';
   };

c1.onmouseleave = clearTooltips;
c1.ontouchleave = clearTooltips;
c2.onmouseleave = clearTooltips;
c2.ontouchleave = clearTooltips;

var chart = new Chart(ctx, {
    type: 'LineWithLine',
    data: {
        labels: ['29.01.', '30.01.', '31.01.', '01.02.', '02.02.', '03.02.', '04.02.', '05.02.', '06.02.', '07.02.', '08.02.', '09.02.', '10.02.', '11.02.', '12.02.', '13.02.', '14.02.', '15.02.', '16.02.', '17.02.', '18.02.', '19.02.', '20.02.', '21.02.', '22.02.', '23.02.', '24.02.', '25.02.', '26.02.', '27.02.', '28.02.', '29.02.', '01.03.', '02.03.', '03.03.', '04.03.', '05.03.', '06.03.', '07.03.', '08.03.'],
        datasets: [{
            label: 'Tartuntoja',
            data: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 2, 1, 1, 0, 5, 3, 4, 4, 7],
            borderColor: '#2D5520',

            fill: true,
            backgroundColor: '#2D5520'
        }]
    },
    options: cvfGraphOptions
});


var chart2 = new Chart(ctx2, {
    type: 'LineWithLine',
    data: {
        labels: ['29.01.', '30.01.', '31.01.', '01.02.', '02.02.', '03.02.', '04.02.', '05.02.', '06.02.', '07.02.', '08.02.', '09.02.', '10.02.', '11.02.', '12.02.', '13.02.', '14.02.', '15.02.', '16.02.', '17.02.', '18.02.', '19.02.', '20.02.', '21.02.', '22.02.', '23.02.', '24.02.', '25.02.', '26.02.', '27.02.', '28.02.', '29.02.', '01.03.', '02.03.', '03.03.', '04.03.', '05.03.', '06.03.', '07.03.', '08.03.'],
        datasets: [{
            label: 'Tartuntoja yhteensä',
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 5, 6, 6, 12, 15, 19, 23, 30, 30],
            borderColor: '#2D5520',

            fill: true,
            backgroundColor: '#2D5520'
        }]
    },
    options: cvfGraphOptions
});

/*
,
    plugins: {
        datasource: {
            url: 'https://ahnl.github.io/coronavirus-finland/total.csv'
        }
    }
    */