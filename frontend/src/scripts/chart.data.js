import Chart from 'chart.js';

var ctx = document.getElementById('myChart');

var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


if (ctx !== null) {
    var config = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'My First dataset',
                borderColor: '#0000ff',
                backgroundColor: '#0000ff',
                data: [12, 19, 3, 5, 2, 3],
            }, {
                label: 'My Second dataset',
                borderColor: '#00ff00',
                backgroundColor: '#00ff00',
                data: [14, 21, 2, 6, 2, 9],
            }, {
                label: 'My Third dataset',
                borderColor: '#ff0000',
                backgroundColor: '#ff0000',
                data: [1, 2, 3, 9, 5, 4],
            }, {
                label: 'My Third dataset',
                borderColor: '#ff00ff',
                backgroundColor: '#ff00ff',
                data: [21, 7, 2, 7, 8, 2],
            }]
        },
        options: {
            responsive: true,
            title: {
                display: false,
                text: 'Chart.js Line Chart - Stacked Area'
            },
            tooltips: {
                mode: 'index',
            },
            hover: {
                mode: 'index'
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: false,
                        labelString: 'Month'
                    }
                }],
                yAxes: [{
                    stacked: true,
                    scaleLabel: {
                        display: false,
                        labelString: 'Value'
                    }
                }]
            }
        }
    });
}
