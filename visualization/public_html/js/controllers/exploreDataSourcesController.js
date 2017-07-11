/* global d3 */
'use strict';
angular.module('map').controller('exploreDataSourcesController', ['$scope', '$interval', '$location', 'sharedDataFoursquare', function ($scope, $interval, $location, sharedDataFoursquare) {
        activeClass('#exploreDataSources', ['#landingPage', '#topicModeling', '#statistics']);
        $scope.leaveMargin = 'topmargin';
        $scope.num=0;
        $scope.ExploreDataSourcesSharedDataFoursquare = sharedDataFoursquare;
        $scope.foursquareExplorePageCities = {
            options: ['Cities']
        };
        $scope.ExploreDataSourcesSharedDataFoursquare.forEach(function (d) {
            $scope.foursquareExplorePageCities.options.push(d.name);
        });
        initializeFoursquareExploreDataSources($scope, $location);
    }]);


function initializeFoursquareExploreDataSources($scope, $location) {
    $scope.foursquareExploreSelectedCity = 'Rome';
    $scope.FoursquareExploreDataSourcesHistory = {
        cityName: null,
        skip: 0,
        size: 500,
        date_from: '2016-12-01',
        date_to: '2016-12-30',
        initialize: true,
        maxDataVolume: 2000,
        foursquareQuery: "food cheese beer",
        clearCurrentFoursquareCity:function(){$scope.currentFoursquareSelectedCity=undefined;},
        foursquareData: [],
        foursquareDataQueryResults: []
    };
    $scope.ExploreDataSourcesFoursquareDataSources = {
        selected: 'FourSquare',
        sources: ['DataSource', 'FourSquare', 'Twitter'],
        maxValue: '#Records',
        maxValueOptions: ['#Records', 2000, 3000, 4000, 5000, 10000]
    };
    $scope.ExploreDataSourcesFoursquareRedirect = function () {
        if ($scope.ExploreDataSourcesFoursquareDataSources.selected === 'FourSquare') {
        } else if ($scope.ExploreDataSourcesFoursquareDataSources.selected === 'Twitter') {
            $location.path('/searchTwitter');
        }
    };
    $scope.pressedFunctionExploreDataSourcesFoursquare = function (cityName) {
        if ($scope.foursquareExploreSelectedCity === 'Cities') {
            return;
        }
        if (!cityName) {
            cityName = $scope.foursquareExploreSelectedCity;
        }
        if ($scope.currentFoursquareSelectedCity === cityName) {
            return;
        }
        $scope.ExploreDataSourcesFoursquareDataSources.selected = $scope.ExploreDataSourcesFoursquareDataSources.selected === 'DataSource' ? 'FourSquare' : $scope.ExploreDataSourcesFoursquareDataSources.selected;
        $scope.ExploreDataSourcesFoursquareDataSources.maxValue = $scope.ExploreDataSourcesFoursquareDataSources.maxValue === '#Records' ? 2000 : $scope.ExploreDataSourcesFoursquareDataSources.maxValue;
        initializeExploreDataSourcesFoursquareProgressBar($scope);
        exploreDataSourcesFoursquareClearTable($scope);
        exploreDataSourcesFoursquareRestoreDataDefaults($scope);
        exploreDataSourcesFoursquareUpdateRequestParamaters($scope, cityName);
        if ($scope.FoursquareExploreDataSourcesHistory.foursquareQuery) {
            initProgressBar();
            makeRequestAPI_FoursquareSearchTerm($scope);
            //$scope.FoursquareExploreDataSourcesHistory.foursquareQuery = null;
        } else {
            //makeRequestAPI_getFoursquareComments($scope);
            finishExploreDataSourcesFoursquareProgressBar($scope);
        }
        $scope.currentFoursquareSelectedCity = cityName ? cityName : 'Rome';
        $scope.searchButton = 'search ' + $scope.currentFoursquareSelectedCity;
    };
    createExploreDataSourcesFoursquareBrush($scope);
    $scope.searchButton = 'search ' + $scope.currentFoursquareSelectedCity;
}


function exploreDataSourcesFoursquareClearTable($scope) {
    if ($scope.FoursquareExploreDataSourcesHistory.initialize) {
        return;
    } else {
        var datatable = $scope.dataFoursquareTab;
        datatable.clear().draw();
    }
}

function exploreDataSourcesFoursquareRestoreDataDefaults($scope) {
    $scope.FoursquareExploreDataSourcesHistory.foursquareData = [];
    $scope.FoursquareExploreDataSourcesHistory.foursquareDataQueryResults = [];
    $scope.FoursquareExploreDataSourcesHistory.cityName = null;
    $scope.FoursquareExploreDataSourcesHistory.skip = 0;
    $scope.FoursquareExploreDataSourcesHistory.maxDataVolume = $scope.ExploreDataSourcesFoursquareDataSources.maxValue;
}


function exploreDataSourcesFoursquareUpdateRequestParamaters($scope, city) {
    if ($scope.FoursquareExploreDataSourcesHistory.cityName) {
        $scope.FoursquareExploreDataSourcesHistory.skip = $scope.FoursquareExploreDataSourcesHistory.cityName === city ? $scope.FoursquareExploreDataSourcesHistory.skip + $scope.FoursquareExploreDataSourcesHistory.size : 0;
        $scope.FoursquareExploreDataSourcesHistory.cityName = city;
    } else {
        //$scope.FoursquareExploreDataSourcesHistory.cityName = city;
        var name = city;
        if (city === 'Athens') {
            name = 'Athens, Greece';
        } else if (city === 'Paris') {
            name = 'Paris, France';
        } else if (city === 'London') {
            name = 'London, United Kingdom';
        } else if (city === 'Amsterdam') {
            name = 'Amsterdam, Netherlands';
        } else if (city === 'Berlin') {
            name = 'Berlin, Germany';
        } else if (city === 'Rome') {
            name = 'Rome, Italy';
        } else if (city === 'Barcelona') {
            name = 'Barcelona, Spain';
        } else if (city === 'Lisbon') {
            name = 'Lisbon, Portugal';
        } else if (city === 'Brussels') {
            name = 'Brussels, Belgium';
        } else if (city === 'Prague') {
            name = 'Prague, Czech Republic';
        }
        $scope.FoursquareExploreDataSourcesHistory.cityName = name;
    }
}

function createExploreDataSourcesFoursquareBrush($scope) {
    var svg = d3.select("#brush4ID"),
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
    gBrush.call(brush.move, [new Date(2011, 11, 25), new Date(2015, 11, 29)].map(x));
    function brushmoved() {
        var s = d3.event.selection;
        handle.attr("display", null).attr("transform", function (d, i) {
            return "translate(" + s[i] + "," + height / 2 + ")";
        });
    }
    function apicall() {
        var s = d3.event.selection;
        var d1 = x.invert(s[0]);
        var d2 = x.invert(s[1]);
        var date_from = d1.getFullYear() + "-" + (+d1.getMonth() + 1) + "-" + d1.getDate();//'2016-12-01',
        var date_to = d2.getFullYear() + "-" + (+d2.getMonth() + 1) + "-" + d2.getDate();//'2016-12-01',
        $scope.FoursquareExploreDataSourcesHistory.date_from = date_from;
        $scope.FoursquareExploreDataSourcesHistory.date_to = date_to;
        $scope.currentFoursquareSelectedCity=undefined;
        $scope.pressedFunctionExploreDataSourcesFoursquare($scope.foursquareExploreSelectedCity);
    }
}

function makeRequestAPI_getFoursquareComments($scope) {
    var data = {
        "date_from": $scope.FoursquareExploreDataSourcesHistory.date_from,
        "date_to": $scope.FoursquareExploreDataSourcesHistory.date_to,
        'skip': $scope.FoursquareExploreDataSourcesHistory.skip,
        'size': $scope.FoursquareExploreDataSourcesHistory.size,
        'crawler': $scope.FoursquareExploreDataSourcesHistory.cityName
    };
    var datajson = JSON.stringify(data);
    var url = 'http://dataservices.ilsp.gr:29928/foursquare/get_comments';
    $.ajax({
        url: url,
        type: "POST",
        data: datajson,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            aggregateFoursquareAPIData(response, $scope);
            if (response.length <= 1 || $scope.FoursquareExploreDataSourcesHistory.foursquareData.length >= $scope.FoursquareExploreDataSourcesHistory.maxDataVolume ||
                    response.results.length <= 1) {
                renderFoursquareAPIData($scope);
            } else {
                exploreDataSourcesFoursquareUpdateRequestParamaters($scope, $scope.FoursquareExploreDataSourcesHistory.cityName);
                makeRequestAPI_getFoursquareComments($scope);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error while comunicating with the API. get makeRequestAPI_getFoursquareComments");
        }
    });
}

function aggregateFoursquareAPIData(data, $scope) {
    var array = data.results;
    array.forEach(function (d) {
        $scope.FoursquareExploreDataSourcesHistory.foursquareData.push([d.text, d.id, d.user_id, d.createdAt]);
    });
    updateExploreDataSourcesFoursquareProgressBar($scope);
}

function renderFoursquareAPIData($scope) {
    var dataObject = {
        columns: [{
                title: "text"
            }, {
                title: "comment_id"
            }, {
                title: "user_id"
            }, {
                title: "created_at"
            }]
    };
    if ($scope.FoursquareExploreDataSourcesHistory.initialize) {
        //$scope.dataFoursquareTab = $('#example').DataTable({
        $scope.dataFoursquareTab = $('#exampleFoursquare').DataTable({
            data: $scope.FoursquareExploreDataSourcesHistory.foursquareData,
            columns: dataObject.columns,
            columnDefs: [
                {
                    "targets": [1, 2],
                    "visible": false,
                    "searchable": false

                }]
        });
        $scope.FoursquareExploreDataSourcesHistory.initialize = false;
    } else {
        var datatable = $scope.dataFoursquareTab;
        datatable.clear().draw();
        datatable.rows.add($scope.FoursquareExploreDataSourcesHistory.foursquareData); // Add new data
        datatable.columns.adjust().draw(); // Redraw the DataTable
    }
    finishExploreDataSourcesFoursquareProgressBar($scope);
}

function initializeExploreDataSourcesFoursquareProgressBar($scope) {
    $('.progress').removeClass("hidden");
    $('.progress-bar').css('width', 0 + '%').attr('aria-valuenow', 0);
    $('.progress-bar').html(0 + " % Complete");
    $('.progress-bar').css("width", 0 + "%");
}

function updateExploreDataSourcesFoursquareProgressBar($scope) {
    var maxDataVolume = $scope.FoursquareExploreDataSourcesHistory.maxDataVolume;
    var currentDataVolume = $scope.FoursquareExploreDataSourcesHistory.foursquareData.length;
    var currentValuePercent = ((currentDataVolume / maxDataVolume) * 100);
    $('.progress').removeClass("hidden");
    $('.progress-bar').css('width', currentValuePercent + '%').attr('aria-valuenow', currentValuePercent);
    $('.progress-bar').html(currentValuePercent + " % Complete");
    $('.progress-bar').css("width", currentValuePercent + "%");
}

function finishExploreDataSourcesFoursquareProgressBar($scope) {
    $('.progress-bar').css('width', 100 + '%').attr('aria-valuenow', 100);
    $('.progress-bar').html(100 + " % Complete");
    $('.progress').addClass("hidden");
}




function makeRequestAPI_FoursquareSearchTerm($scope) {
    var queryTerms = $scope.FoursquareExploreDataSourcesHistory.foursquareQuery.split(' ');
    var data = {
        "date_from": $scope.FoursquareExploreDataSourcesHistory.date_from,
        "date_to": $scope.FoursquareExploreDataSourcesHistory.date_to,
        "terms": queryTerms,
        "source": 'foursquare',
        "crawler": $scope.FoursquareExploreDataSourcesHistory.cityName
    };

    var datajson = JSON.stringify(data);
    var url = 'http://dataservices.ilsp.gr:29928/search_terms';
    $.ajax({
        url: url,
        type: "POST",
        data: datajson,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            renderFoursquareSearchResults($scope, response);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error while comunicating with the API. query terms");
        }
    });

    function renderFoursquareSearchResults($scope, response) {
        var array = response.results;
        array.forEach(function (d) {
            //$scope.FoursquareExploreDataSourcesHistory.foursquareDataQueryResults.push([d.text, d.id, d.poi_id, d.user_id, d.createdAt]);
            $scope.FoursquareExploreDataSourcesHistory.foursquareDataQueryResults.push([d.text, d.id, d.poi_id, d.createdAt]);
        });
        updateExploreDataSourcesFoursquareProgressBar($scope);
        var dataObject = {
            columns: [{
                    title: "text"
                }, {
                    title: "comment_id"
                }, {
                    title: "user_id"
                }, {
                    title: "created_at"
                }]
        };
        if ($scope.FoursquareExploreDataSourcesHistory.initialize) {
            //$scope.dataFoursquareTab = $('#example').DataTable({
            $scope.dataFoursquareTab = $('#exampleFoursquare').DataTable({
                data: $scope.FoursquareExploreDataSourcesHistory.foursquareDataQueryResults,
                columns: dataObject.columns,
                columnDefs: [
                    {
                        "targets": [1, 2],
                        "visible": false,
                        "searchable": false

                    }]
            });
            $scope.FoursquareExploreDataSourcesHistory.initialize = false;
        } else {
            var datatable = $scope.dataFoursquareTab;
            datatable.clear().draw();
            datatable.rows.add($scope.FoursquareExploreDataSourcesHistory.foursquareDataQueryResults); // Add new data
            datatable.columns.adjust().draw(); // Redraw the DataTable
        }
        finishExploreDataSourcesFoursquareProgressBar($scope);
        finishProgressBar();
    }
}

function initProgressBar() {
    var number = randomIntFromInterval(50, 90);
    $('.progress').removeClass("hidden");
    $('.progress-bar').css('width', number + '%').attr('aria-valuenow', number);
    $('.progress-bar').html(number + " % Complete");
    $('.progress-bar').css("width", number + "%");
}


function finishProgressBar() {
    $('.progress-bar').css('width', 100 + '%').attr('aria-valuenow', 100);
    $('.progress-bar').html(100 + " % Complete");
    $('.progress').addClass("hidden");
}


function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}