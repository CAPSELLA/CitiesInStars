/* global d3 */
/* global Highcharts*/
'use strict';
angular.module('map').controller('statisticsController', ['$scope', '$interval', '$location', 'sharedDataFoursquare', function ($scope, $interval, $location, sharedDataFoursquare) {
        activeClass('#statistics', ['#landingPage', '#topicModeling', '#exploreDataSources']);
        $scope.leaveMargin = 'no-top-margin';
        $scope.sharedDataFoursquare = sharedDataFoursquare;
        initialize($scope, $location);
        //alert('statistics is working');
    }]);
function initialize($scope, $location) {
    $scope.StatisticsFoursquareDataSources = {
        selected: 'FourSquare',
        sources: ['FourSquare', 'Twitter']
    };
    $scope.foursquareRedirect = function () {
        if ($scope.StatisticsFoursquareDataSources.selected === 'FourSquare') {
        } else if ($scope.StatisticsFoursquareDataSources.selected === 'Twitter') {
            $location.path('/twitterStatistics');
        }
    };
    $scope.updateFoursquareComments = function (response) {
        createFourSquareStatistics(response, $scope);
    };
    MyChartComponent.initHighcharts();
    createBrush($scope);
}

function createBrush($scope) {
    var svg = d3.select("#brushID"),
            margin = {top: 25, right: 0, bottom: 25, left: 0},
    width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //var x = d3.scaleTime().domain([new Date(2016, 11, 20), new Date(2017, 1, 2)]).range([0, width]);
    var x = d3.scaleTime().domain([new Date(2010, 1, 1), new Date(2017, 1, 2)]).range([0, width]);
    var xAxis = d3.axisBottom(x);
    //xAxis.ticks(d3.timeDay.every(2)).tickFormat(d3.timeFormat("%d %b"));
    xAxis.ticks(d3.timeMonth.every(4)).tickFormat(d3.timeFormat("%m %Y"));
    var brush = d3.brushX().extent([[0, 0], [width, height]]).on("start brush end", brushmoved);
    brush.on("end", apicall);
    g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    var gBrush = g.append("g")
            .attr("class", "brush")
            .call(brush);
    var handle = gBrush.selectAll(".handle--custom")
            .data([{type: "w"}, {type: "e"}])
            .enter().append("path")
            .attr("class", "handle--custom")
            .attr("fill", "#666")
            .attr("fill-opacity", 0.8)
            .attr("stroke", "#000")
            .attr("stroke-width", 1.5)
            .attr("cursor", "ew-resize")
            .attr("d", d3.arc()
                    .innerRadius(0)
                    .outerRadius(height / 2)
                    .startAngle(0)
                    .endAngle(function (d, i) {
                        return i ? Math.PI : -Math.PI;
                    }));
    gBrush.call(brush.move, [new Date(2016, 9, 25), new Date(2016, 11, 29)].map(x));
    function brushmoved() {
        var s = d3.event.selection;
        handle.attr("display", null).attr("transform", function (d, i) {
            return "translate(" + s[i] + "," + height / 2 + ")";
        });
    }
    function apicall() {
        $scope.statisticsFoursquareDates = {
            date_from: null,
            date_to: null
        };
        var s = d3.event.selection;
        var d1 = x.invert(s[0]);
        var d2 = x.invert(s[1]);
        if(Math.abs(d1.getFullYear()-d2.getFullYear())>4){
            gBrush.call(brush.move, [d1, new Date(d1.getFullYear()+4, d1.getMonth(), d1.getDate())].map(x));
            return;
        }
        var date_from = d1.getFullYear() + "-" + (+d1.getMonth() + 1) + "-" + d1.getDate(); //'2016-12-01',
        var date_to = d2.getFullYear() + "-" + (+d2.getMonth() + 1) + "-" + d2.getDate(); //'2016-12-01',
        initializeFoursquareStatisticsProgressBar($scope);
        $scope.statisticsFoursquareDates.date_from = date_from;
        $scope.statisticsFoursquareDates.date_to = date_to;
        makeRequestAPI_countFoursquareComments($scope, date_from, date_to);
    }
}


var chart;
function createFourSquareStatistics(response, $scope) {
    if (!response || response.length <= 1) {
        alert('Empty response from server. ' + JSON.stringify(response));
        //return;
    }
    var sharedData = $scope.sharedDataFoursquare; //d.name,d.pois,d.comments
    for (var x in response) {
        var xs = x.toString().split(',')[0];
        for (var i = 0; i < sharedData.length; i++) {
            if (sharedData[i].name === xs) {
                sharedData[i].comments = +response[x];
            }
        }
    }
    $scope.foursquareTitle = 'Foursquare comments and pois per City, ' + $scope.statisticsFoursquareDates.date_from + " - " + $scope.statisticsFoursquareDates.date_to;
    $scope.$apply();
    var comments = [];

    sharedData.forEach(function (d) {
        comments.push(d.comments);
    });
    //
    /* for(var i=0; i<10; i++){
     comments.push(randomIntFromInterval(10000,100000));
     }*/
    //
    //MyChartComponent.setDataFromApi(comments);
    //MyChartComponent.updateChart();    
    chart.series[1].setData(comments);
    chart.redraw();
    finishFoursquareStatisticsProgressBar();
}

var MyChartComponent = {
    initHighcharts: function () {
        chart = new Highcharts.Chart({
            chart: {
                type: 'column',
                renderTo: 'FoursquareChart'
            },
            title: {
                text: 'Pois per city'
            },
            subtitle: {
                text: 'Source: Foursquare'
            },
            xAxis: {
                categories: [
                    'Athens',
                    'Paris',
                    'London',
                    'Amsterdam',
                    'Berlin',
                    'Rome',
                    'Barcelona',
                    'Lisbon',
                    'Brussels',
                    'Prague'
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: '#Points Of Interest'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y} </b></td></tr>',
                //'<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                    name: 'pois',
                    data: [5432, 17250, 16888, 3851, 6998, 5882, 6595, 3519, 5428, 4600]
                }, {
                    name: 'comments',
                    data: [4656, 31802, 122433, 4824, 29386, 523, 7920, 320, 2196, 12342]
                }]
        });
    }, //initchart()
    setDataFromApi: function (comments) {
        this.dataFromApi = [{
                name: 'pois',
                data: [5432, 17250, 16888, 3851, 6998, 5882, 6595, 3519, 5428, 4600]
            }, {
                name: 'comments',
                data: comments
            }];
    },
    updateChart: function () {
        /*/this.dataFromApi.forEach(function (serie) {
         this.chart.addSeries(serie, false);
         }.bind(this));*/
        chart.redraw();
        chart.hideLoading();
    }
};//chart

function initializeFoursquareStatisticsProgressBar($scope) {
    $('.progress').removeClass("hidden");
    $('.progress-bar').css('width', 63 + '%').attr('aria-valuenow', 63);
    $('.progress-bar').html(63 + " % Complete");
    $('.progress-bar').css("width", 63 + "%");
}


function finishFoursquareStatisticsProgressBar($scope) {
    $('.progress-bar').css('width', 100 + '%').attr('aria-valuenow', 100);
    $('.progress-bar').html(100 + " % Complete");
    $('.progress').addClass("hidden");
}