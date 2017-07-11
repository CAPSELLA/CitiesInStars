/* global d3 */
/* global google*/
'use strict';
var sc;
var markers;
var onMapMarkersArray = [];
var burgerMarkers;
var onMapBuregerMarkersArray = [];

angular.module('map').controller('topicModelingController', ['$scope', '$interval', '$location', '$routeParams', '$timeout', 'sharedDataFoursquare', 'sharedCoordinates', function ($scope, $interval, $location, $routeParams, $timeout, sharedDataFoursquare, sharedCoordinates) {
        activeClass('#topicModeling', ['#landingPage', '#statistics', '#exploreDataSources']);
        $scope.leaveMargin = 'no-top-margin';
        $('#mapDiv').addClass("hidden");
        $scope.topicModelingSharedData = sharedDataFoursquare;
        $scope.topicModelingPageCities = {
            options: ['Cities']
        };
        $scope.topicModelingSharedData.forEach(function (d) {
            $scope.topicModelingPageCities.options.push(d.name);
        });
        $scope.sharedCoordinates = sharedCoordinates;
        $scope.timeOut = function () {
            if (sc.city.source === "twitter") {
                return;
            }
            $timeout(function () {
                sc.loadInfo = "";
                //sc.$apply();
            }, 2500);
        };
        $scope.displayTextWithDelay = function (message, delay) {
            $timeout(function () {
                sc.loadInfo = message;
                //sc.$apply();
            }, delay);
        };
        $scope.twitterMapMessage = "Topics from twitter do not have a map visualization, due to scarce tweets' coordinates.";
        topicModelingInitialize($scope, $routeParams);
    }]);

function topicModelingInitialize($scope, $routeParams) {
    sc = $scope;
    $scope.visualizations = ['Intensity comments heatmaps', 'Sentiment of each comment', 'Positive sentiment heatmaps', 'Negative sentiment heatmaps'];
    $scope.visualizationSelected = $scope.visualizations[0];//'Sentiment Visualization';
    $scope.topicModelingCitySelected = 'Rome';
    $scope.currentTopicModelingSelectedCity = 'Rome';
    $scope.currentVisualization = 'Intensity comments heatmaps';
    $scope.dataTableObj = null;
    $scope.Dimotika = false;
    $scope.Gymnasia = false;
    $scope.Likia = false;
    $scope.comments = {
        initialize: true,
        addedlistener: false,
        topicData: []
    };
    $scope.city = {
        name: null,
        dataToRender: null,
        source: null,
        topicLabel: null
    };
    $scope.pressedFunctionVisualization = function (visualizationOption) {
        pressedVisualize(visualizationOption);
    };
    $scope.pressedFunctionTopicModeling = function (cityName) {
        if (!cityName) {
            cityName = $scope.topicModelingCitySelected;
        }
        if ($scope.currentTopicModelingSelectedCity === cityName) {
            return;
        }
        sc.city.name = cityName;
        initProgressBar();
        makeVisualization($scope, cityName);
        $scope.currentTopicModelingSelectedCity = cityName ? cityName : 'Rome';
    };
    var param1 = $routeParams.id || localStorage.topicToShow;
    $scope.parameter = param1;
    var paramCity = existParam(param1);
    if (paramCity) {
        $scope.redirectFromLandingPage = true;
        $scope.routeParam = param1;
        $scope.topicModelingCitySelected = paramCity;
        $scope.currentTopicModelingSelectedCity = undefined;
        $scope.pressedFunctionTopicModeling(paramCity);
    } else {
        $scope.redirectFromLandingPage = false;
        $scope.routeParam = null;
        makeVisualization($scope, 'Rome');
        sc.city.name = 'Rome';
    }
}

function existParam(param1) {
    if (param1) {
        if (param1.indexOf('tweets') !== -1 || param1.indexOf('foursquare') !== -1) {
            var city = findCity(param1);
            return city;
        }
    }
    return false;
}

function findCity(param1) {
    if (param1.indexOf('Rome') !== -1) {
        return 'Rome';
    } else if (param1.indexOf('Athens') !== -1) {
        return 'Athens';
    } else if (param1.indexOf('Barcelona') !== -1) {
        return 'Barcelona';
    } else if (param1.indexOf('Brussels') !== -1) {
        return 'Brussels';
    } else if (param1.indexOf('Paris') !== -1) {
        return 'Paris';
    } else if (param1.indexOf('Berlin') !== -1) {
        return 'Berlin';
    } else if (param1.indexOf('Lisbon') !== -1) {
        return 'Lisbon';
    } else if (param1.indexOf('Amsterdam') !== -1) {
        return 'Amsterdam';
    } else if (param1.indexOf('Prague') !== -1) {
        return 'Prague';
    } else if (param1.indexOf('London') !== -1) {
        return 'London';
    } else {
        return undefined;
    }
}

function makeVisualization($scope, cityName) {
    markers = [];
    if (cityName === 'Rome') {
        readRome($scope);
    } else if (cityName === 'Athens') {
        readAthens($scope);
    } else if (cityName === 'Barcelona') {
        readBarcelona($scope);
    } else if (cityName === 'Brussels') {
        readBrussels($scope);
    } else if (cityName === 'Paris') {
        readParis($scope);
    } else if (cityName === 'Berlin') {
        readBerlin($scope);
    } else if (cityName === 'Lisbon') {
        readLisbon($scope);
    } else if (cityName === 'Amsterdam') {
        readAmsterdam($scope);
    } else if (cityName === 'Prague') {
        readPrague($scope);
    } else if (cityName === 'London') {
        readLondon($scope);
    } else {
        finishProgressBar();
    }
}

function readRome($scope) {
    d3.queue().defer(d3.csv, 'content/Rome/csv/' + 'Rome_12_10_terms' + '.csv')
            .defer(d3.csv, 'content/Rome/csv/' + 'Rome_1001_10_docs' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Rome__Italy_33', 'tweets_Rome__Italy_36', 'tweets_Rome__Italy_39', 'foursquare_Rome__Italy_02', 'foursquare_Rome__Italy_07', 'foursquare_Rome__Italy_08', 'foursquare_Rome__Italy_16', 'foursquare_Rome__Italy_17', 'foursquare_Rome__Italy_19', 'foursquare_Rome__Italy_20'];
                    doStuff(file1, file2, topicsIDs, $scope);
                }
            });
}
function readAthens($scope) {
    d3.queue().defer(d3.csv, 'content/Athens/csv/' + 'Athens_labels' + '.csv')
            .defer(d3.csv, 'content/Athens/csv/' + 'Athens_docs' + '.csv')
            .defer(d3.json, 'content/Athens/json/' + 'schools_athens' + '.json')
            .defer(d3.json, 'content/Athens/json/' + 'burgers_houses_athens' + '.json')
            .await(function (error, file1, file2, file3, file4) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Athens__Greece_20', 'tweets_Athens__Greece_27', 'foursquare_Athens__Greece_11', 'foursquare_Athens__Greece_12', 'foursquare_Athens__Greece_14', 'foursquare_Athens__Greece_15', 'foursquare_Athens__Greece_16', 'foursquare_Athens__Greece_22', 'foursquare_Athens__Greece_28', 'foursquare_Athens__Greece_29', 'foursquare_Athens__Greece_06'];
                    doStuff(file1, file2, topicsIDs, $scope);
                    markers = file3;
                    burgerMarkers = file4;
                }
            });
}
function readBarcelona($scope) {
    d3.queue().defer(d3.csv, 'content/Barcelona/csv/' + 'Barcelona_labels_x' + '.csv')
            .defer(d3.csv, 'content/Barcelona/csv/' + 'Barcelona_docs_x' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Barcelona__Spain_19', 'foursquare_Barcelona__Spain_05', 'foursquare_Barcelona__Spain_10', 'foursquare_Barcelona__Spain_15', 'foursquare_Barcelona__Spain_24', 'foursquare_Barcelona__Spain_33', 'foursquare_Barcelona__Spain_35', 'foursquare_Barcelona__Spain_38', 'foursquare_Barcelona__Spain_39', 'foursquare_Barcelona__Spain_09'];
                    doStuff(file1, file2, topicsIDs, $scope);
                }
            });
}
function readBrussels($scope) {
    d3.queue().defer(d3.csv, 'content/Brussels/csv/' + 'Brussels_labels_x' + '.csv')
            .defer(d3.csv, 'content/Brussels/csv/' + 'Brussels_docs_x' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Brussels__Belgium_24', 'tweets_Brussels__Belgium_10', 'foursquare_Brussels__Belgium_01', 'foursquare_Brussels__Belgium_05', 'foursquare_Brussels__Belgium_06', 'foursquare_Brussels__Belgium_16', 'foursquare_Brussels__Belgium_19', 'foursquare_Brussels__Belgium_25', 'foursquare_Brussels__Belgium_36', 'foursquare_Brussels__Belgium_43'];
                    doStuff(file1, file2, topicsIDs, $scope);
                }
            });
}

function readParis($scope) {
    d3.queue().defer(d3.csv, 'content/Paris/csv/' + 'Paris_labels_x' + '.csv')
            .defer(d3.csv, 'content/Paris/csv/' + 'Paris_docs_x' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Paris__France_30', 'tweets_Paris__France_28', 'foursquare_Paris__France_04', 'foursquare_Paris__France_08', 'foursquare_Paris__France_14', 'foursquare_Paris__France_16', 'foursquare_Paris__France_17', 'foursquare_Paris__France_25', 'foursquare_Paris__France_28', 'foursquare_Paris__France_29', 'foursquare_Paris__France_31'];
                    doStuff(file1, file2, topicsIDs, $scope);
                }
            });
}

function readBerlin($scope) {
    d3.queue().defer(d3.csv, 'content/Berlin/csv/' + 'Berlin_labels_x' + '.csv')
            .defer(d3.csv, 'content/Berlin/csv/' + 'Berlin_docs_x' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Berlin__Germany_08', 'tweets_Berlin__Germany_42', 'foursquare_Berlin__Germany_04', 'foursquare_Berlin__Germany_07', 'foursquare_Berlin__Germany_08', 'foursquare_Berlin__Germany_10', 'foursquare_Berlin__Germany_11', 'foursquare_Berlin__Germany_40', 'foursquare_Berlin__Germany_43', 'foursquare_Berlin__Germany_50'];
                    doStuff(file1, file2, topicsIDs, $scope);
                }
            });
}

function readLisbon($scope) {
    d3.queue().defer(d3.csv, 'content/Lisbon/csv/' + 'Lisbon_labels_x' + '.csv')
            .defer(d3.csv, 'content/Lisbon/csv/' + 'Lisbon_docs_x' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Lisbon__Portugal_34', 'tweets_Lisbon__Portugal_49', 'foursquare_Lisbon__Portugal_12', 'foursquare_Lisbon__Portugal_17', 'foursquare_Lisbon__Portugal_20', 'foursquare_Lisbon__Portugal_25', 'foursquare_Lisbon__Portugal_28', 'foursquare_Lisbon__Portugal_31', 'foursquare_Lisbon__Portugal_46', 'foursquare_Lisbon__Portugal_33'];
                    doStuff(file1, file2, topicsIDs, $scope);
                }
            });
}

function readAmsterdam($scope) {
    d3.queue().defer(d3.csv, 'content/Amsterdam/csv/' + 'Amsterdam_labels_x' + '.csv')
            .defer(d3.csv, 'content/Amsterdam/csv/' + 'Amsterdam_docs_x' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Amsterdam__Netherlands_21', 'tweets_Amsterdam__Netherlands_28', 'foursquare_Amsterdam__Netherlands_01', 'foursquare_Amsterdam__Netherlands_09', 'foursquare_Amsterdam__Netherlands_13', 'foursquare_Amsterdam__Netherlands_24', 'foursquare_Amsterdam__Netherlands_31', 'foursquare_Amsterdam__Netherlands_32', 'foursquare_Amsterdam__Netherlands_44', 'foursquare_Amsterdam__Netherlands_10'];
                    doStuff(file1, file2, topicsIDs, $scope);
                }
            });
}

function readPrague($scope) {
    d3.queue().defer(d3.csv, 'content/Prague/csv/' + 'Prague_labels_x' + '.csv')
            .defer(d3.csv, 'content/Prague/csv/' + 'Prague_docs_x' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Prague__Czech_Republic_17', 'tweets_Prague__Czech_Republic_24', 'foursquare_Prague__Czech_Republic_05', 'foursquare_Prague__Czech_Republic_12', 'foursquare_Prague__Czech_Republic_15', 'foursquare_Prague__Czech_Republic_20', 'foursquare_Prague__Czech_Republic_21', 'foursquare_Prague__Czech_Republic_24', 'foursquare_Prague__Czech_Republic_33', 'foursquare_Prague__Czech_Republic_09'];
                    doStuff(file1, file2, topicsIDs, $scope);
                }
            });
}

function readLondon($scope) {
    d3.queue().defer(d3.csv, 'content/London/csv/' + 'London_labels' + '.csv')
            .defer(d3.csv, 'content/London/csv/' + 'London_docs' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['foursquare_London__United_Kingdom_04', 'foursquare_London__United_Kingdom_06', 'foursquare_London__United_Kingdom_08', 'foursquare_London__United_Kingdom_11', 'foursquare_London__United_Kingdom_14', 'foursquare_London__United_Kingdom_20', 'foursquare_London__United_Kingdom_31', 'foursquare_London__United_Kingdom_41', 'foursquare_London__United_Kingdom_44', 'foursquare_London__United_Kingdom_50'];
                    doStuff(file1, file2, topicsIDs, $scope);
                }
            });
}

function doStuff(dataTerms, dataIds, topicsIDs, $scope) {
    var data = [];
    for (var i = 0; i < topicsIDs.length; i++) {
        data.push({topicID: topicsIDs[i], docIDs: [], terms: [], label: null});
    }
    for (var i = 0; i < dataTerms.length; i++) {
        var row = dataTerms[i];
        for (var property in row) {
            if (row.hasOwnProperty(property)) {
                var obj = findObj(property);
                obj.terms.push(row[property]);
            }
        }
    }
    for (var i = 0; i < dataIds.length; i++) {
        var row = dataIds[i];
        for (var property in row) {
            if (row.hasOwnProperty(property)) {
                var obj = findObj(property);
                obj.label = obj.terms[0];
                obj.docIDs.push(row[property]);
            }
        }
    }
    function findObj(key) {
        var result = data.filter(function (obj) {
            return obj['topicID'] === key;
        });
        return result[0];
    }
    data.filter(function (d) {
        d.terms.shift();
        return d;
    });
    makeLabelsTable(data, $scope);
}

function makeLabelsTable(data, $scope) {
    clearTables($scope);
    appendTable(data, $scope);
}

function appendTable(data, $scope) {
    var headerLabels = ["TopicNo", "Label", "Top_Words"];
    d3.select("#TopicModelingDiv").append("table").attr("id", "TopicModelingTable")
            .attr("class", "table table-striped table-bordered")
            .append("thead")
            .append("tr")
            .selectAll("th")
            .data(headerLabels)
            .enter()
            .append("th")
            .html(function (d) {
                return d;
            });
    var tr = d3.select("#TopicModelingTable").append("tbody");
    tr.selectAll("tr").data(data).enter().append("tr").each(function (d) {
        var coma = " ";
        for (var i = 0; i < d.terms.length; i++) {
            coma += " " + d.terms[i] + ", ";
        }
        d3.select(this).append("td").html(d.topicID);
        d3.select(this).append("td").html(d.label);
        d3.select(this).append("td").html(coma);
        d3.select(this).on("click", getComments);
    });
    $scope.dataTableObj = $("#TopicModelingTable").DataTable({
        "autoWidth": false,
        "columnsDefs": {"width": "1px", "targets": 0},
        columnDefs: [
            {
                "targets": [0],
                "visible": false,
                "searchable": false

            }]
    });
    finishProgressBar();
    addHighlightRowListener(sc.dataTableObj);
    triggerClickEvent(data);
}

function addHighlightRowListener(table) {
    $('#TopicModelingTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}

function triggerClickEvent(data) {
    var row = row ? row : data[5];
    if (!sc.parameter) {
        data.forEach(function (d) {
            if (d.topicID.indexOf('foursquare') !== -1 && !row) {
                row = d;
            }
        });
    } else {
        data.forEach(function (d) {
            if (d.topicID === sc.parameter) {
                row = d;
            }
        });
    }
    localStorage.topicToShow = undefined;
    sc.parameter = undefined;
    artificialClick(sc.dataTableObj, row);
    getComments(row);
}

function artificialClick(table, rowData) {
    var data = table.row(0).data();
    var indexes = table.rows().eq(0).filter(function (rowIdx) {
        return table.cell(rowIdx, 0).data() === rowData.topicID ? true : false;
    });
    table.rows(indexes)
            .nodes()
            .to$()
            .addClass('selected');
}

function getComments(row) {
    var topicId = row.topicID.toString();
    var docsIDs = row.docIDs;
    initProgressBar();
    if (topicId.indexOf("foursquare_") !== -1) {
        sc.loadInfo = "Map is loading, please wait .... ";
        sc.$apply();
        makeRequestAPI_getTopicsTextsFoursquare(docsIDs, topicId);
    } else if (topicId.indexOf("tweets_") !== -1) {
        sc.twitterMapMessage="Twitter topic " + row.label + " does not have a map visualization, due to scarce tweets' coordinates.";
        sc.loadInfo=sc.twitterMapMessage;
        sc.$apply();
        makeRequestAPI_getTopicsTextsTwitter(docsIDs, topicId);
    }
}

function makeRequestAPI_getTopicsTextsFoursquare(ids, topicId) {
    var data = {
        "ids": ids
    };
    var datajson = JSON.stringify(data);
    var url = 'http://dataservices.ilsp.gr:29928/foursquare/comments_from_elk_ids';
    $.ajax({
        url: url,
        type: "POST",
        data: datajson,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            renderResults(response, 'foursquare', topicId);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error while communicating with the API. get makeRequestAPI_getTopicsTexts");
        }
    });
}

function makeRequestAPI_getTopicsTextsTwitter(ids, topicId) {
    var data = {
        "ids": ids
    };
    var datajson = JSON.stringify(data);
    var url = 'http://dataservices.ilsp.gr:29928/twitter/comments_from_elk_ids';
    $.ajax({
        url: url,
        type: "POST",
        data: datajson,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            renderResults(response, 'twitter', topicId);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error while communicating with the API. get makeRequestAPI_getTopicsTextsTwitter");
        }
    });
}

function renderResults(response, source, topicId) {
    sc.city.dataToRender = null;
    if (!response || response.length <= 0) {
        finishProgressBar();
        alert('Empty results from server. Possible server issue.');
        return;
    }
    var array = response.results;
    var data = [];
    if (source === 'foursquare') {
        sc.city.dataToRender = array;
        sc.city.source = 'foursquare';
        array.forEach(function (d) {
            if (d.crawler.indexOf(sc.city.name) !== -1) {
                data.push([d.text, d.id, topicId, d.crawler, d.createdAt, Number(d.dpappas_sentiment).toFixed(4) + '' === 'NaN' ? Number(1).toFixed(4) : Number(d.dpappas_sentiment).toFixed(4)]);//data.push([d.text, d.id, topicId, d.crawler, d.createdAt, d.dpappas_sentiment]);///data.push([d.text, d.id, topicId, d.crawler, d.createdAt, parseFloat(d.dpappas_sentiment).toFixed(4)]);//data.push([d.text, d.id, topicId, d.crawler, d.createdAt, d.dpappas_sentiment.toPrecision( 4 )]);
            } else {
                //console.log("found: " + JSON.stringify(d) + "\tfor" + sc.city.name);
            }
        });
    } else if (source === 'twitter') {
        sc.city.source = 'twitter';
        array.forEach(function (d) {
            if (d.crawler.indexOf(sc.city.name) !== -1) {
                data.push([d.text, d.id, topicId, d.crawler, d.created_at, ""]);
            } else {
                //console.log("found: " + JSON.stringify(d) + "\tfor" + sc.city.name);
            }
        });
    }
    var dataObject = {
        columns: [{
                title: "text"
            }, {
                title: "comment_id"
            }, {
                title: "topic_id"
            }, {
                title: "city"
            }, {
                title: "created_at"
            }, {title: "sentiment_confidence"
            }
        ]
    };
    if (sc.comments.initialize) {
        sc.commentsTable = $('#TopicModelingTableComments').DataTable({
            data: data,
            columns: dataObject.columns,
            columnDefs: [
                {
                    "targets": [1, 2, 5],
                    //"targets": [1, 2],
                    "visible": false,
                    "searchable": false

                }]
                    //order: [[5, 'desc']]
        });
        if (!sc.comments.addedlistener) {
            addlistener();
        }
        sc.comments.initialize = false;
    } else {
        var datatable = sc.commentsTable;
        datatable.clear().draw();
        datatable.rows.add(data); // Add new data
        datatable.columns.adjust().draw(); // Redraw the DataTable
        if (!sc.comments.addedlistener) {
            addlistener();
        }
    }
    if (sc.city.source === 'foursquare') {
        initMap();
    } else {
        initMap();
        var message = sc.twitterMapMessage;
        var delay = 2000;
        //sc.displayTextWithDelay(message, delay);
    }
    finishProgressBar();
}

function addlistener() {
    sc.comments.addedlistener = true;
    var table = sc.commentsTable;
    $('#TopicModelingTableComments tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        if (data) {
            if (data[2].indexOf("twee") !== -1) {
                openlink(data[1]);
            }
        }
    });
}

function openlink(id) {
    var page_url = "https://twitter.com/statuses/" + id;
    window.open(page_url, '_blank');
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

function clearTables($scope) {
    $scope.comments.topicData = [];
    if (!$scope.comments.initialize) {
        var datatable = sc.commentsTable;
        datatable.clear().draw();
    }
    if ($scope.dataTableObj) {
        var table = $('#TopicModelingTable').DataTable();
        table.destroy();
        $('#TopicModelingTable').remove();
    }
}


function getCoordinatesData() {
    var array = sc.sharedCoordinates.filter(function (d) {
        if (d.name === sc.city.name) {
            return d;
        }
    });
    return array[0];
}
var map;
var heatmap;
var sentimentCircles = [];
var osmMapType = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom) {
        return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
    },
    tileSize: new google.maps.Size(256, 256),
    name: "OpenStreetMap", maxZoom: 18
});
function initMap() {
    var coordinatesData = getCoordinatesData();
    google.maps.visualRefresh = true;
    var mapOptions = {
        center: new google.maps.LatLng(coordinatesData.center.lat, coordinatesData.center.lon),
        zoom: 15,
        mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, 'bluish_style', 'OSM']}
    };
    $('#mapDiv').removeClass("hidden");
    var mapElement = document.getElementById('mapDiv');
    map = new google.maps.Map(mapElement, mapOptions);
    var bluishStyledMap = new google.maps.StyledMapType(bluishStyle, {name: "Bluish"});
    map.mapTypes.set('bluish_style', bluishStyledMap);
    //map.setMapTypeId('bluish_style');
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    //map.setMapTypeId('OSM');
    map.mapTypes.set('OSM', osmMapType);
    boundboxMap(coordinatesData);
    clearMarkers("allMarkers");
    clearBurgerMarkers();
    if (sc.sentimentMaster) {
        removeHeatMap();
        removeCircles();
        appendCircles();
    } else if (sc.positiveSentimentMaster) {
        removeHeatMap();
        removeCircles();
        appendPositiveHeatmap();
    } else if (sc.negativeSentimentMaster) {
        removeHeatMap();
        removeCircles();
        appendNegativeHeatmap();
    } else {
        removeCircles();
        removeHeatMap();
        appendHeatMap();
    }
    appendMarkers();
    map.setZoom(15);
    sc.de = 0;
}

function boundboxMap(coordinatesData) {
    var southWest = new google.maps.LatLng(coordinatesData.box.southWest.lat, coordinatesData.box.southWest.lon);
    var northEast = new google.maps.LatLng(coordinatesData.box.northEast.lat, coordinatesData.box.northEast.lon);
    var bounds = new google.maps.LatLngBounds(southWest, northEast);
    map.fitBounds(bounds);
}

function appendCircles() {
    initProgressBar();
    var heatMapData = getPoints(sc.city.dataToRender);
    for (var i = 0; i < heatMapData.length; i++) {
        var comment = heatMapData[i];
        var commentCircle = new google.maps.Circle({
            strokeColor: comment.weight > 0.5 ? '#00FF00' : '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 1, //2
            fillColor: comment.weight > 0.5 ? '#00FF00' : '#FF0000',
            fillOpacity: calculateCirlceOpacity(comment.weight), //comment.weight > 0.7 ? 1 : 0.3,
            map: map,
            clickable: true,
            center: comment.location,
            radius: 2 * 20//3*25
        });
        sentimentCircles.push(commentCircle);
        createClickableCircle(map, commentCircle, comment);
    }
    finishProgressBar();
    sc.timeOut();
}
var infowindow = new google.maps.InfoWindow({});

function createClickableCircle(map, circle, info) {
    /*var infowindow = new google.maps.InfoWindow({
     content: getInfoText(info)
     });*/
    google.maps.event.addListener(circle, 'mouseover', function (ev) {
        infowindow.setContent(getInfoText(info));
        infowindow.setPosition(circle.getCenter());
        infowindow.open(map);
        //infowindow = false;
        //infowindowClosed = false;
    });
}

function getInfoText(info) {
//"poi_id": "54fd90b0498e1fc14126b465", "user_id": "34620713", "dpappas_sentiment": 0.10526219010353088, "lat": 37.977488, "text": "Try any burger...!!!", "lng": 23.729379, "id": "56802b4038fae7db8363f727", "createdAt": "2015-12-27 20:17:36"
    var text = "";
    text += "<span><p>text: <strong>" + info.text + "</strong></p></span>";
    text += "<span><p>sentiment: <strong>" + info.sentiment + "</strong></p></span>";
    text += "<span><p>createdAt: <strong>" + info.createdAt + "</strong></p></span>";
    text += "<span><p>id: <strong>" + info.id + "</strong></p></span>";
    return text;
}



function calculateCirlceOpacity(weight) {
    if (weight >= 0.5) {
        return weight;
    } else {
        return 1 - weight;
    }
}

function removeCircles() {
    if (sentimentCircles.length !== 0) {
        remove_circle();
        sentimentCircles.forEach(function (d) {
            d.setMap(null);
        });
    }
    sentimentCircles = [];
    infowindow = new google.maps.InfoWindow({});
    //remove_circle();
    //sc.$apply();
}

function remove_circle() {
    if (!sentimentCircles || sentimentCircles.length === 0) {
        return;
    }
    // remove event listers
    sentimentCircles.forEach(function (d) {
        google.maps.event.clearListeners(d, 'mouseover');
    });

}

function removeHeatMap() {
    if (heatmap) {
        heatmap.setMap(null);
    }
}

function appendHeatMap() {
    var heatMapData = getPoints(sc.city.dataToRender);
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapData,
        map: map
    });
    changeGradient();
    changeRadius();//
    //changeOpacity();
    heatmap.set('maxIntensity', 1);//150//
    heatmap.setMap(map);
    sc.timeOut();
}

function appendPositiveHeatmap() {
    var heatMapData = getPoints(sc.city.dataToRender);
    heatMapData = heatMapData.filter(function (d) {
        return d.weight > 0.5;
    });
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapData,
        map: map
    });
    changePositiveGradient();
    changeRadius();//
    //changeOpacity();
    heatmap.set('maxIntensity', 1);//150//
    heatmap.setMap(map);
    sc.timeOut();
}

function appendNegativeHeatmap() {
    var heatMapData = getPoints(sc.city.dataToRender);
    heatMapData = heatMapData.filter(function (d) {
        return Number(d.weight) <= 0.5;
    });
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapData,
        map: map
    });
    changeNegativeGradient();
    changeRadius();//
    //changeOpacity();
    heatmap.set('maxIntensity', 1);//150//
    heatmap.setMap(map);
    sc.timeOut();
}

function appendMarkers() {
    if (sc.master) {
        setMarkers("allMarkers");
    }
    if (sc.burgerMaster) {
        setBurgerMarkers();
    }
}

function getPoints(dataToRender) {
    var array = [];
    if (sc.city.source === 'twitter') {
    } else {
        if (dataToRender && dataToRender.length > 0) {
            dataToRender.forEach(function (d) {
                // array.push(new google.maps.LatLng(d.lat, d.lng));
                //array.push({location: new google.maps.LatLng(d.lat, d.lng), weight: 0.5});// old used
                var weight = d.dpappas_sentiment ? d.dpappas_sentiment : 0.5;
                //var weight = 1;
                //alert(weight);
                //"poi_id": "54fd90b0498e1fc14126b465", "user_id": "34620713", "dpappas_sentiment": 0.10526219010353088, "lat": 37.977488, "text": "Try any burger...!!!", "lng": 23.729379, "id": "56802b4038fae7db8363f727", "createdAt": "2015-12-27 20:17:36"
                array.push({location: new google.maps.LatLng(d.lat, d.lng),
                    weight: weight,
                    text: d.text,
                    sentiment: d.dpappas_sentiment,
                    poid: d.poi_id,
                    user: d.user_id,
                    createdAt: d.createdAt,
                    lat: d.lat,
                    lon: d.lng,
                    id: d.id
                });
            });
        }
    }
    return array;
}

var bluishStyle = [
    {
        stylers: [{hue: "#009999"}, {saturation: -5}, {lightness: -40}]
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{lightness: 100}, {visibility: "simplified"}]
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{hue: "#0000FF"}, {saturation: -40}]
    },
    {
        featureType: "administrative.neighborhood",
        elementType: "labels.text.stroke",
        stylers: [{color: "#E80000"}, {weight: 1}]
    },
    {
        featureType: "road",
        elementType: "labels.text",
        stylers: [{visibility: "off"}]
    },
    {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [{color: "#FF00FF"}, {weight: 2}]
    }
];

function changeGradient() {
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ];
    /*var gradient = [
     'rgba(0, 255, 255, 0)',
     'rgba(255,0,0,1)',
     'rgba(255,128,0,1)',
     'rgba(255,2550,0,1)',
     'rgba(0,255,0,1)'
     //'rgba(' + Math.round(255 * rate) + ', ' + Math.round(255 * (1 - rate)) + ', 0, 1)'];
     ];*/
    heatmap.set('gradient', gradient);
}

function changePositiveGradient() {
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 210, 100, 1)',
        'rgba(0, 255, 0, 1)'
    ];
    heatmap.set('gradient', gradient);
}

function changeNegativeGradient() {
    var gradient = [
        'rgba(255, 0, 255, 0)',
        /*'rgba(255, 0, 0, 0.8)',*/
        'rgba(255, 0, 0, 0.9)',
        'rgba(255, 0, 0, 1)'
    ];
    heatmap.set('gradient', gradient);
}

function changeRadius() {
    heatmap.set('radius', 30);//50//150
}

function changeOpacity() {
    //heatmap.set('opacity', .5);
}

function toggleMarkers() {
    if (!sc.master) {
        setMarkers("allMarkers");
        sc.Dimotika = true;
        sc.Gymnasia = true;
        sc.Likia = true;
    } else {
        clearMarkers("allMarkers");
        sc.Dimotika = false;
        sc.Gymnasia = false;
        sc.Likia = false;
    }
}

function toggleBurgerMarkers() {
    if (!sc.burgerMaster) {
        setBurgerMarkers();
    } else {
        clearBurgerMarkers();
    }
}

function toggleDimotikaMarkers() {
    if (!sc.Dimotika) {
        setDimotika();
    } else {
        clearDimotika();
    }
}

function toggleGymnasiaMarkers() {
    if (!sc.Gymnasia) {
        setGymnasia();
    } else {
        clearGymnasia();
    }
}

function toggleLikiaMarkers() {
    if (!sc.Likia) {
        setLikia();
    } else {
        clearLikia();
    }
}

function toggleSentiment() {
    sc.positiveSentimentMaster = false;
    sc.negativeSentimentMaster = false;
    if (!sc.sentimentMaster) {
        removeHeatMap();
        appendCircles();
    } else {
        removeCircles();
        appendHeatMap();
    }
}

function positivetogleSentiment() {
    sc.negativeSentimentMaster = false;
    if (!sc.positiveSentimentMaster) {
        removeHeatMap();
        removeCircles();
        appendPositiveHeatmap();
    } else {
        removeCircles();
        removeHeatMap();
        appendHeatMap();
    }
}
function negativetogleSentiment() {
    sc.positiveSentimentMaster = false;
    if (!sc.negativeSentimentMaster) {
        removeHeatMap();
        removeCircles();
        appendNegativeHeatmap();
    } else {
        removeCircles();
        removeHeatMap();
        appendHeatMap();
    }
}

var image = {
    url: 'img/flag.png',
    size: new google.maps.Size(20, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
};
var imageInfo = {
    url: 'img/icon36.png',
    size: new google.maps.Size(32, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
};
var imagePin = {
    url: 'img/icon63.png',
    size: new google.maps.Size(32, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
};
var imageGreen = {
    url: 'img/green-dot.png',
    size: new google.maps.Size(32, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
};
var imageBlue = {
    url: 'img/blue-dot.png',
    size: new google.maps.Size(32, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
};
var imageGreenCircle = {
    url: 'img/icon16.png',
    size: new google.maps.Size(32, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
};

function setMarkers(targetMarkers) {
    if (!markers || markers.length === 0) {
        return;
    }
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].schoolName.indexOf('ΓΥΜΝΑΣΙΟ') === -1 && markers[i].schoolName.indexOf('ΛΥΚΕΙΟ') === -1 && markers[i].schoolName.indexOf('ΔΗΜΟΤΙΚΟ') === -1) {////ΝΗΠΙΑΓΩΓΕΙΟ,ΤΕΕ,ΣΕΚ,ΚΕΣΥΠ
            continue;
        }
        var school = markers[i];
        school["type"] = markers[i].schoolName.indexOf('ΓΥΜΝΑΣΙΟ') !== -1 ? "0" : markers[i].schoolName.indexOf('ΛΥΚΕΙΟ') !== -1 ? "1" : markers[i].schoolName.indexOf('ΔΗΜΟΤΙΚΟ') !== -1 ? "2" : "3";
        var marker = new google.maps.Marker({
            position: {lat: school.lat, lng: school.lon},
            map: map,
            icon: school.type === "0" ? imageGreen : school.type === "1" ? imagePin : school.type === "2" ? imageInfo : null,
            type: school.type,
            title: school.schoolName,
            zIndex: i
        });
        if (targetMarkers === school.type) {////gymn:0,lik:1,dim:2
            onMapMarkersArray.push(marker);
        } else if (targetMarkers === "allMarkers") {
            onMapMarkersArray.push(marker);
        }
    }
}

function setBurgerMarkers() {
    if (!burgerMarkers || burgerMarkers.length === 0) {
        return;
    }
    var image = {
        url: 'img/bur.png',
        size: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32)
    };
    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };
    for (var i = 0; i < burgerMarkers.length; i++) {
        var burgerHouse = burgerMarkers[i];
        var marker = new google.maps.Marker({
            position: {lat: burgerHouse.lat, lng: burgerHouse.lon},
            map: map,
            icon: image,
            shape: shape,
            title: burgerHouse.name,
            zIndex: i
        });
        onMapBuregerMarkersArray.push(marker);
    }
}

function setDimotika() {
    for (var i = 0; i < onMapMarkersArray.length; i++) {//gymn:0,lik:1,dim:2
        if (onMapMarkersArray[i].type === "2") {
            onMapMarkersArray[i].setMap(map);
        }
    }
}
function setGymnasia() {
    for (var i = 0; i < onMapMarkersArray.length; i++) {//gymn:0,lik:1,dim:2
        if (onMapMarkersArray[i].type === "0") {
            onMapMarkersArray[i].setMap(map);
        }
    }
}

function setLikia() {
    ;
    for (var i = 0; i < onMapMarkersArray.length; i++) {//gymn:0,lik:1,dim:2
        if (onMapMarkersArray[i].type === "1") {
            onMapMarkersArray[i].setMap(map);
        }
    }
}

function clearDimotika() {
    clearMarkers("2");
}

function clearLikia() {
    clearMarkers("1");
}

function clearGymnasia() {
    clearMarkers("0");
}

function clearMarkers(targetMarkers) {
    if (!onMapMarkersArray || onMapMarkersArray.length === 0) {
        return;
    }
    for (var i = 0; i < onMapMarkersArray.length; i++) {
        if (onMapMarkersArray[i].type === targetMarkers) {
            onMapMarkersArray[i].setMap(null);
        }
    }
    if (targetMarkers === "allMarkers") {
        for (var i = 0; i < onMapMarkersArray.length; i++) {
            onMapMarkersArray[i].setMap(null);
        }
        onMapMarkersArray = [];
    }
}

function clearBurgerMarkers() {
    if (!onMapBuregerMarkersArray || onMapBuregerMarkersArray.length === 0) {
        return;
    }
    for (var i = 0; i < onMapBuregerMarkersArray.length; i++) {
        onMapBuregerMarkersArray[i].setMap(null);
    }
    onMapBuregerMarkersArray = [];
}


function pressedVisualize(option) {
    if (!option) {
        option = sc.visualizationSelected;
    }
    if (sc.currentVisualization === option) {
        return;
    }
//['Intensity comments heatmaps', 'Sentiment of each comment', 'Positive sentiment heatmaps', 'Negative sentiment heatmaps'];
    if (option === 'Sentiment of each comment') {
        if (sc.city.source === "twitter") {
            sc.loadInfo = sc.twitterMapMessage;
        } else {
            //sc.loadInfo = "Loading sentiment data into map, please wait....";
        }
        //sc.$apply();
        sc.currentVisualization = option;
        sc.sentimentMaster = true;
        sc.positiveSentimentMaster = false;
        sc.negativeSentimentMaster = false;
    } else if (option === 'Positive sentiment heatmaps') {
        if (sc.city.source === "twitter") {
            sc.loadInfo = sc.twitterMapMessage;
        } else {
            //sc.loadInfo = "Loading positive sentiment heatmaps, please wait....";
        }
        //sc.$apply();
        sc.currentVisualization = option;
        sc.sentimentMaster = false;
        sc.positiveSentimentMaster = true;
        sc.negativeSentimentMaster = false;
    } else if (option === 'Negative sentiment heatmaps') {
        if (sc.city.source === "twitter") {
            sc.loadInfo = sc.twitterMapMessage;
        } else {
            //sc.loadInfo = "Loading negative sentiment heatmaps, please wait....";
        }
        //sc.$apply();
        sc.currentVisualization = option;
        sc.sentimentMaster = false;
        sc.positiveSentimentMaster = false;
        sc.negativeSentimentMaster = true;
    } else if (option === 'Intensity comments heatmaps') {
        if (sc.city.source === "twitter") {
            sc.loadInfo = sc.twitterMapMessage;
        } else {
            //sc.loadInfo = "Loading comments' intesity heatmaps, please wait....";
        }
        //sc.$apply();
        sc.currentVisualization = option;
        sc.sentimentMaster = false;
        sc.positiveSentimentMaster = false;
        sc.negativeSentimentMaster = false;
    } else {
        sc.loadInfo = "";
        return;
    }
    applySentimentVisualization();
}

function applySentimentVisualization() {
    if (sc.sentimentMaster) {
        removeHeatMap();
        removeCircles();
        appendCircles();
        $('#TopicModelingTableComments').DataTable().order([0, 'desc']).draw();
    } else if (sc.positiveSentimentMaster) {
        removeCircles();
        removeHeatMap();
        appendPositiveHeatmap();
        $('#TopicModelingTableComments').DataTable().order([5, 'desc']).draw();
    } else if (sc.negativeSentimentMaster) {
        removeCircles();
        removeHeatMap();
        appendNegativeHeatmap();
        $('#TopicModelingTableComments').DataTable().order([5, 'asc']).draw();
    } else {
        removeCircles();
        removeHeatMap();
        appendHeatMap();
        $('#TopicModelingTableComments').DataTable().order([0, 'desc']).draw();
    }
}
/*
 function clearLoadingInfo() {
 sc.loadInfo = "";
 sc.$apply();
 }*/
/*
 alert(schools_athens.length);
 alert(JSON.stringify(schools_athens));
 alert(schools_athens[0].schoolName+"\t"+schools_athens[0].lat);
 alert(JSON.stringify(schools_athens[0]));
 */