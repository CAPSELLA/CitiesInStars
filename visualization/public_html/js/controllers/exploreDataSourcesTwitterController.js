/* global d3 */
'use strict';
angular.module('map').controller('exploreDataSourcesTwitterController', ['$scope', '$interval', '$location', 'sharedDataTwitter', function ($scope, $interval, $location, sharedDataTwitter) {
        activeClass('#exploreDataSources', ['#landingPage', '#topicModeling', '#statistics']);
        $scope.leaveMargin = 'topmargin';
        $scope.ExploreDataSourcesSharedDataTwitter = sharedDataTwitter;
        $scope.twitterExplorePageCities = {
            options: ['Cities']
        };
        $scope.ExploreDataSourcesSharedDataTwitter.forEach(function (d) {
            $scope.twitterExplorePageCities.options.push(d.name);
        });
        initializeTwitterExploreDataSources($scope, $location);
    }]);


function initializeTwitterExploreDataSources($scope, $location) {
    $scope.twitterExploreSelectedCity = 'Rome';
    $scope.TwitterExploreDataSourcesHistory = {
        cityName: null,
        skip: 0,
        size: 500,
        date_from: '2016-12-01',
        date_to: '2016-12-30',
        initialize: true,
        maxDataVolume: 2000,
        twitterData: [],
        TwitterQuery: 'food cheese beer',
        clearCurrentTwitterCity: function () {
            $scope.currentTwitterSelectedCity = undefined;
        },
        TwitterDataQueryResults: [],
        addedListener: false
    };
    $scope.ExploreDataSourcesTwitterDataSources = {
        selected: 'Twitter',
        sources: ['Twitter', 'FourSquare'],
        maxValue: 2000,
        maxValueOptions: [2000, 3000, 4000, 5000, 10000]
    };
    $scope.ExploreDataSourcesTwitterRedirect = function () {
        if ($scope.ExploreDataSourcesTwitterDataSources.selected === 'FourSquare') {
            $location.path('/search');
        } else if ($scope.ExploreDataSourcesTwitterDataSources.selected === 'Twitter') {
        }
    };
    $scope.pressedFunctionExploreDataSourcesTwitter = function (cityName) {
        if ($scope.twitterExploreSelectedCity === 'Cities') {
            return;
        }
        if (!cityName) {
            cityName = $scope.twitterExploreSelectedCity;
        }
        if ($scope.currentTwitterSelectedCity === cityName) {
            return;
        }
        initializeExploreDataSourcesTwitterProgressBar($scope);
        exploreDataSourcesTwitterClearTable($scope);
        exploreDataSourcesTwitterRestoreDataDefaults($scope);
        exploreDataSourcesTwitterUpdateRequestParamaters($scope, cityName);
        if ($scope.TwitterExploreDataSourcesHistory.TwitterQuery) {
            initProgressBar();
            makeRequestAPI_TwitterSearchTerm($scope);
            //$scope.TwitterExploreDataSourcesHistory.TwitterQuery = null;
        } else {
            //makeRequestAPI_getTweets($scope);///!!!!!!!!!!!
            finishExploreDataSourcesTwitterProgressBar($scope);
        }
        $scope.currentTwitterSelectedCity = cityName ? cityName : 'Rome';
        $scope.twitterSearchButton = 'search ' + $scope.currentTwitterSelectedCity;
    };
    createExploreDataSourcesTwitterBrush($scope);
    $scope.twitterSearchButton = 'search ' + $scope.currentTwitterSelectedCity;
}


function exploreDataSourcesTwitterClearTable($scope) {
    if ($scope.TwitterExploreDataSourcesHistory.initialize) {
        return;
    } else {
        var datatable = $scope.dataTwitterTab;
        datatable.clear().draw();
    }
}

function exploreDataSourcesTwitterRestoreDataDefaults($scope) {
    $scope.TwitterExploreDataSourcesHistory.twitterData = [];
    $scope.TwitterExploreDataSourcesHistory.TwitterDataQueryResults = [];
    $scope.TwitterExploreDataSourcesHistory.cityName = null;
    $scope.TwitterExploreDataSourcesHistory.skip = 0;
    $scope.TwitterExploreDataSourcesHistory.maxDataVolume = $scope.ExploreDataSourcesTwitterDataSources.maxValue;
}


function exploreDataSourcesTwitterUpdateRequestParamaters($scope, city) {
    if ($scope.TwitterExploreDataSourcesHistory.cityName) {
        $scope.TwitterExploreDataSourcesHistory.skip = $scope.TwitterExploreDataSourcesHistory.cityName === city ? $scope.TwitterExploreDataSourcesHistory.skip + $scope.TwitterExploreDataSourcesHistory.size : 0;
        $scope.TwitterExploreDataSourcesHistory.cityName = city;
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
        $scope.TwitterExploreDataSourcesHistory.cityName = name;
    }
}

function createExploreDataSourcesTwitterBrush($scope) {
    var svg = d3.select("#brush3ID"),
            margin = {top: 25, right: 0, bottom: 25, left: 0},
    width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var x = d3.scaleTime().domain([new Date(2016, 11, 20), new Date(2017, 1, 2)]).range([0, width]);
    var xAxis = d3.axisBottom(x);
    xAxis.ticks(d3.timeDay.every(2)).tickFormat(d3.timeFormat("%d %b"));
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
    gBrush.call(brush.move, [new Date(2016, 11, 25), new Date(2016, 11, 29)].map(x));
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
        $scope.TwitterExploreDataSourcesHistory.date_from = date_from;
        $scope.TwitterExploreDataSourcesHistory.date_to = date_to;
        $scope.currentTwitterSelectedCity = undefined;
        $scope.pressedFunctionExploreDataSourcesTwitter($scope.twitterExploreSelectedCity);
    }
}

function makeRequestAPI_getTweets($scope) {
    var data = {
        "date_from": $scope.TwitterExploreDataSourcesHistory.date_from,
        "date_to": $scope.TwitterExploreDataSourcesHistory.date_to,
        'skip': $scope.TwitterExploreDataSourcesHistory.skip,
        'size': $scope.TwitterExploreDataSourcesHistory.size,
        'crawler': $scope.TwitterExploreDataSourcesHistory.cityName
    };
    var datajson = JSON.stringify(data);
    var url = 'http://dataservices.ilsp.gr:29928/twitter/get_comments';
    $.ajax({
        url: url,
        type: "POST",
        data: datajson,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            aggregateTwitterAPIData(response, $scope);
            if (response.length <= 1 || $scope.TwitterExploreDataSourcesHistory.twitterData.length >= $scope.TwitterExploreDataSourcesHistory.maxDataVolume ||
                    response.results.length <= 1) {
                renderTwitterAPIData($scope);
            } else {
                exploreDataSourcesTwitterUpdateRequestParamaters($scope, $scope.TwitterExploreDataSourcesHistory.cityName);
                makeRequestAPI_getTweets($scope);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error while comunicating with the API. get makeRequestAPI_getTweets");
        }
    });
}

function aggregateTwitterAPIData(data, $scope) {
    var array = data.results;
    array.forEach(function (d) {
        $scope.TwitterExploreDataSourcesHistory.twitterData.push([d.text, d.id, d.created_at]);
    });
    updateExploreDataSourcesTwitterProgressBar($scope);
}

function renderTwitterAPIData($scope) {
    finishExploreDataSourcesTwitterProgressBar($scope);
    var dataObject = {
        columns: [{
                title: "text"
            }, {
                title: "tweet_id"
            }, {
                title: "created_at"
            }]
    };
    if ($scope.TwitterExploreDataSourcesHistory.initialize) {
        $scope.dataTwitterTab = $('#example').DataTable({
            data: $scope.TwitterExploreDataSourcesHistory.twitterData,
            columns: dataObject.columns,
            columnDefs: [
                {
                    "targets": [1],
                    "visible": false,
                    "searchable": false

                }]
        });
        $scope.TwitterExploreDataSourcesHistory.initialize = false;
        if (!$scope.TwitterExploreDataSourcesHistory.addedListener) {
            addSearchlistener($scope);
        }
    } else {
        var datatable = $scope.dataTwitterTab;
        datatable.clear().draw();
        datatable.rows.add($scope.TwitterExploreDataSourcesHistory.twitterData); // Add new data
        datatable.columns.adjust().draw(); // Redraw the DataTable
        if (!$scope.TwitterExploreDataSourcesHistory.addedListener) {
            addSearchlistener($scope);
        }
    }
}

function addSearchlistener($scope) {
    $scope.TwitterExploreDataSourcesHistory.addedListener = true;
    var table = $scope.dataTwitterTab;
    $('#example tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        if (data) {
            //"text" "tweet_id" "created_at"
            //if (data[2].indexOf("twee") !== -1) {
            //alert(data[0] + " comma " + data[1] + " comma " + data[2]);
            openSearchlink(data[1]);
            //}
        }
    });
}

function openSearchlink(id) {
    var page_url = "https://twitter.com/statuses/" + id;
    //window.location.href=page_url;
    window.open(page_url, '_blank');
}

function initializeExploreDataSourcesTwitterProgressBar($scope) {
    $('.progress').removeClass("hidden");
    $('.progress-bar').css('width', 0 + '%').attr('aria-valuenow', 0);
    $('.progress-bar').html(0 + " % Complete");
    $('.progress-bar').css("width", 0 + "%");
}

function updateExploreDataSourcesTwitterProgressBar($scope) {
    var maxDataVolume = $scope.TwitterExploreDataSourcesHistory.maxDataVolume;
    var currentDataVolume = $scope.TwitterExploreDataSourcesHistory.twitterData.length;
    var currentValuePercent = ((currentDataVolume / maxDataVolume) * 100);
    $('.progress').removeClass("hidden");
    $('.progress-bar').css('width', currentValuePercent + '%').attr('aria-valuenow', currentValuePercent);
    $('.progress-bar').html(currentValuePercent + " % Complete");
    $('.progress-bar').css("width", currentValuePercent + "%");
}

function finishExploreDataSourcesTwitterProgressBar($scope) {
    $('.progress-bar').css('width', 100 + '%').attr('aria-valuenow', 100);
    $('.progress-bar').html(100 + " % Complete");
    $('.progress').addClass("hidden");
}


function makeRequestAPI_TwitterSearchTerm($scope) {
    var queryTerms = $scope.TwitterExploreDataSourcesHistory.TwitterQuery.split(' ');
    var data = {
        "date_from": $scope.TwitterExploreDataSourcesHistory.date_from,
        "date_to": $scope.TwitterExploreDataSourcesHistory.date_to,
        "terms": queryTerms,
        "source": 'twitter',
        "crawler": $scope.TwitterExploreDataSourcesHistory.cityName
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
            renderTwitterSearchResults($scope, response);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error while comunicating with the API. query terms");
        }
    });

    function renderTwitterSearchResults($scope, response) {
        var array = response.results;
        array.forEach(function (d) {
            $scope.TwitterExploreDataSourcesHistory.TwitterDataQueryResults.push([d.text, d.id, d.created_at]);
        });
        updateExploreDataSourcesTwitterProgressBar($scope);
        var dataObject = {
            columns: [{
                    title: "text"
                }, {
                    title: "tweet_id"
                }, {
                    title: "created_at"
                }]
        };
        if ($scope.TwitterExploreDataSourcesHistory.initialize) {
            $scope.dataTwitterTab = $('#example').DataTable({
                data: $scope.TwitterExploreDataSourcesHistory.TwitterDataQueryResults,
                columns: dataObject.columns,
                columnDefs: [
                    {
                        "targets": [1],
                        "visible": false,
                        "searchable": false

                    }]
            });
            $scope.TwitterExploreDataSourcesHistory.initialize = false;
            if (!$scope.TwitterExploreDataSourcesHistory.addedListener) {
                addSearchlistener($scope);
            }
        } else {
            var datatable = $scope.dataTwitterTab;
            datatable.clear().draw();
            datatable.rows.add($scope.TwitterExploreDataSourcesHistory.TwitterDataQueryResults); // Add new data
            datatable.columns.adjust().draw(); // Redraw the DataTable
            if (!$scope.TwitterExploreDataSourcesHistory.addedListener) {
                addSearchlistener($scope);
            }
        }
        finishExploreDataSourcesTwitterProgressBar($scope);
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