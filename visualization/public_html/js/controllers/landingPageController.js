'use strict';
/*global d3*/
angular.module('map').controller('landingPageController', ['$scope', '$interval', '$location', 'sharedDataFoursquare', 'sharedCoordinates', function ($scope, $interval, $location, sharedDataFoursquare, sharedCoordinates) {
        activeClass('#landingPage', ['#topicModeling', '#statistics', '#exploreDataSources']);
        $scope.leaveMargin = 'no-top-margin';
        $scope.landingPageSharedData = sharedDataFoursquare;
        $scope.landingPageCities = {
            options: ['Cities']
        };
        $scope.landingPageSharedData.forEach(function (d) {
            $scope.landingPageCities.options.push(d.name);
        });
        initializeLandingPage($scope, $location);
        LandingPageReadRome($scope);
    }]);
function initializeLandingPage($scope, $location) {
    $scope.firstRun = true;
    $scope.landingPageCitySelected = 'Rome';
    $scope.currentSelectedCity = 'Rome';
    $scope.tooltip = 'Click a word to explore the corresponding topic from '+$scope.currentSelectedCity;
    $scope.pressedFunctionLandingPage = function (cityName) {
        if (!cityName) {
            cityName = $scope.landingPageCitySelected;
        }
        if ($scope.currentSelectedCity === cityName) {
            return;
        }
        $scope.tooltip = 'Click a word to explore the corresponding topic from '+cityName;
        if (cityName === 'Rome') {
            LandingPageReadRome($scope);
        } else if (cityName === 'Athens') {
            LandingPageReadAthens($scope);
        } else if (cityName === 'Barcelona') {
            LandingPageReadBarcelona($scope);
        } else if (cityName === 'Brussels') {
            LandingPageReadBrussels($scope);
        } else if (cityName === 'Paris') {
            LandingPageReadParis($scope);
        } else if (cityName === 'Berlin') {
            LandingPageReadBerlin($scope);
        } else if (cityName === 'Lisbon') {
            LandingPageReadLisbon($scope);
        } else if (cityName === 'Amsterdam') {
            LandingPageReadAmsterdam($scope);
        } else if (cityName === 'Prague') {
            LandingPageReadPrague($scope);
        } else if (cityName === 'London') {
            LandingPageReadLondon($scope);
        } else {
            //alert('Should not appear. City not found.');
            //console.log('Should not appear. City not found.');
        }
        $scope.currentSelectedCity = cityName ? cityName : 'Rome';
    };
    $scope.redirectToExplore = function (id) {
        //$location.path('/explore/' + id);
        $location.path('/explore/');
        localStorage.topicToShow=id;
        //var load=localStorage.specificDynamicTopic;
        $scope.$apply();
    };
}

function LandingPageReadRome($scope) {
    d3.queue().defer(d3.csv, 'content/Rome/csv/' + 'Rome_12_10_terms' + '.csv')
            .defer(d3.csv, 'content/Rome/csv/' + 'Rome_1001_10_docs' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Rome__Italy_33', 'tweets_Rome__Italy_36', 'tweets_Rome__Italy_39', 'foursquare_Rome__Italy_02', 'foursquare_Rome__Italy_07', 'foursquare_Rome__Italy_08', 'foursquare_Rome__Italy_16', 'foursquare_Rome__Italy_17', 'foursquare_Rome__Italy_19', 'foursquare_Rome__Italy_20'];
                    LandingPageDoStuff(file1, file2, topicsIDs, $scope);
                }
            });
}
function LandingPageReadAthens($scope) {
    d3.queue().defer(d3.csv, 'content/Athens/csv/' + 'Athens_labels' + '.csv')
            .defer(d3.csv, 'content/Athens/csv/' + 'Athens_docs' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Athens__Greece_20', 'tweets_Athens__Greece_27', 'foursquare_Athens__Greece_11', 'foursquare_Athens__Greece_12', 'foursquare_Athens__Greece_14', 'foursquare_Athens__Greece_15', 'foursquare_Athens__Greece_16', 'foursquare_Athens__Greece_22', 'foursquare_Athens__Greece_28', 'foursquare_Athens__Greece_29', 'foursquare_Athens__Greece_06'];
                    LandingPageDoStuff(file1, file2, topicsIDs, $scope);
                }
            });
}
function LandingPageReadBarcelona($scope) {
    d3.queue().defer(d3.csv, 'content/Barcelona/csv/' + 'Barcelona_labels_x' + '.csv')
            .defer(d3.csv, 'content/Barcelona/csv/' + 'Barcelona_docs_x' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Barcelona__Spain_19', 'foursquare_Barcelona__Spain_05', 'foursquare_Barcelona__Spain_10', 'foursquare_Barcelona__Spain_15', 'foursquare_Barcelona__Spain_24', 'foursquare_Barcelona__Spain_33', 'foursquare_Barcelona__Spain_35', 'foursquare_Barcelona__Spain_38', 'foursquare_Barcelona__Spain_39', 'foursquare_Barcelona__Spain_09'];
                    LandingPageDoStuff(file1, file2, topicsIDs, $scope);
                }
            });
}
function LandingPageReadBrussels($scope) {
    d3.queue().defer(d3.csv, 'content/Brussels/csv/' + 'Brussels_labels_x' + '.csv')
            .defer(d3.csv, 'content/Brussels/csv/' + 'Brussels_docs_x' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Brussels__Belgium_24', 'tweets_Brussels__Belgium_10', 'foursquare_Brussels__Belgium_01', 'foursquare_Brussels__Belgium_05', 'foursquare_Brussels__Belgium_06', 'foursquare_Brussels__Belgium_16', 'foursquare_Brussels__Belgium_19', 'foursquare_Brussels__Belgium_25', 'foursquare_Brussels__Belgium_36', 'foursquare_Brussels__Belgium_43'];
                    LandingPageDoStuff(file1, file2, topicsIDs, $scope);
                }
            });
}

function LandingPageReadParis($scope) {
    d3.queue().defer(d3.csv, 'content/Paris/csv/' + 'Paris_labels_x' + '.csv')
            .defer(d3.csv, 'content/Paris/csv/' + 'Paris_docs_x' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Paris__France_30', 'tweets_Paris__France_28', 'foursquare_Paris__France_04', 'foursquare_Paris__France_08', 'foursquare_Paris__France_14', 'foursquare_Paris__France_16', 'foursquare_Paris__France_17', 'foursquare_Paris__France_25', 'foursquare_Paris__France_28', 'foursquare_Paris__France_29', 'foursquare_Paris__France_31'];
                    LandingPageDoStuff(file1, file2, topicsIDs, $scope);
                }
            });
}

function LandingPageReadBerlin($scope) {
    d3.queue().defer(d3.csv, 'content/Berlin/csv/' + 'Berlin_labels_x' + '.csv')
            .defer(d3.csv, 'content/Berlin/csv/' + 'Berlin_docs_x' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Berlin__Germany_08', 'tweets_Berlin__Germany_42', 'foursquare_Berlin__Germany_04', 'foursquare_Berlin__Germany_07', 'foursquare_Berlin__Germany_08', 'foursquare_Berlin__Germany_10', 'foursquare_Berlin__Germany_11', 'foursquare_Berlin__Germany_40', 'foursquare_Berlin__Germany_43', 'foursquare_Berlin__Germany_50'];
                    LandingPageDoStuff(file1, file2, topicsIDs, $scope);
                }
            });
}

function LandingPageReadLisbon($scope) {
    d3.queue().defer(d3.csv, 'content/Lisbon/csv/' + 'Lisbon_labels_x' + '.csv')
            .defer(d3.csv, 'content/Lisbon/csv/' + 'Lisbon_docs_x' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Lisbon__Portugal_34', 'tweets_Lisbon__Portugal_49', 'foursquare_Lisbon__Portugal_12', 'foursquare_Lisbon__Portugal_17', 'foursquare_Lisbon__Portugal_20', 'foursquare_Lisbon__Portugal_25', 'foursquare_Lisbon__Portugal_28', 'foursquare_Lisbon__Portugal_31', 'foursquare_Lisbon__Portugal_46', 'foursquare_Lisbon__Portugal_33'];
                    LandingPageDoStuff(file1, file2, topicsIDs, $scope);
                }
            });
}

function LandingPageReadAmsterdam($scope) {
    d3.queue().defer(d3.csv, 'content/Amsterdam/csv/' + 'Amsterdam_labels_x' + '.csv')
            .defer(d3.csv, 'content/Amsterdam/csv/' + 'Amsterdam_docs_x' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Amsterdam__Netherlands_21', 'tweets_Amsterdam__Netherlands_28', 'foursquare_Amsterdam__Netherlands_01', 'foursquare_Amsterdam__Netherlands_09', 'foursquare_Amsterdam__Netherlands_13', 'foursquare_Amsterdam__Netherlands_24', 'foursquare_Amsterdam__Netherlands_31', 'foursquare_Amsterdam__Netherlands_32', 'foursquare_Amsterdam__Netherlands_44', 'foursquare_Amsterdam__Netherlands_10'];
                    LandingPageDoStuff(file1, file2, topicsIDs, $scope);
                }
            });
}

function LandingPageReadPrague($scope) {
    d3.queue().defer(d3.csv, 'content/Prague/csv/' + 'Prague_labels_x' + '.csv')
            .defer(d3.csv, 'content/Prague/csv/' + 'Prague_docs_x' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['tweets_Prague__Czech_Republic_17', 'tweets_Prague__Czech_Republic_24', 'foursquare_Prague__Czech_Republic_05', 'foursquare_Prague__Czech_Republic_12', 'foursquare_Prague__Czech_Republic_15', 'foursquare_Prague__Czech_Republic_20', 'foursquare_Prague__Czech_Republic_21', 'foursquare_Prague__Czech_Republic_24', 'foursquare_Prague__Czech_Republic_33', 'foursquare_Prague__Czech_Republic_09'];
                    LandingPageDoStuff(file1, file2, topicsIDs, $scope);
                }
            });
}

function LandingPageReadLondon($scope) {
    d3.queue().defer(d3.csv, 'content/London/csv/' + 'London_labels' + '.csv')
            .defer(d3.csv, 'content/London/csv/' + 'London_docs' + '.csv')
            .await(function (error, file1, file2) {
                if (error) {
                    alert('Error during data fetching...');
                } else {
                    var topicsIDs = ['foursquare_London__United_Kingdom_04', 'foursquare_London__United_Kingdom_06', 'foursquare_London__United_Kingdom_08', 'foursquare_London__United_Kingdom_11', 'foursquare_London__United_Kingdom_14', 'foursquare_London__United_Kingdom_20', 'foursquare_London__United_Kingdom_31', 'foursquare_London__United_Kingdom_41', 'foursquare_London__United_Kingdom_44', 'foursquare_London__United_Kingdom_50'];
                    LandingPageDoStuff(file1, file2, topicsIDs, $scope);
                }
            });
}

function LandingPageDoStuff(dataTerms, dataIds, topicsIDs, $scope) {
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
    landingPageMakeWordClouds(data, $scope);
}

function landingPageMakeWordClouds(data, $scope) {
    var ar = [];
    data.forEach(function (d, i) {
        d.terms.forEach(function (t, ti) {
            var weightValue = randomIntFromInterval(1, 5);
            if (ti === 1) {
                weightValue = randomIntFromInterval(10, 15);
            } else if (ti === 2) {
                weightValue = randomIntFromInterval(5, 10);
            } else if (ti < 10) {
                weightValue = randomIntFromInterval(1, 5);
            }
            ar.push({text: t, weight: weightValue, handlers: {click: function () {
                        $scope.redirectToExplore(d.topicID);
                    },
                    mouseenter: function () {
                        $scope.tooltip = 'Click ' + t + ' to explore topic ' + d.label + ' from ' + $scope.currentSelectedCity;
                        $scope.$apply();
                    }, mouseleave: function () {
                        $scope.tooltip = 'Click a word to explore the corresponding topic from ' + $scope.currentSelectedCity;
                        $scope.$apply();
                    }
                }
            });
        });
    });
    if ($scope.firstRun) {
        $('#wordcloud').jQCloud(ar);
        $scope.firstRun = false;
    } else {
        $('#wordcloud').jQCloud('update', ar);
    }
}


/*
 function hov() {
 $(document).ready(function () {
 $('#buttonsIDs').hover(enter, leave); // end hover
 function enter() {
 $(this).stop().animate(
 {
 left: '0',
 backgroundColor: 'rgb(27,45,94)'
 },
 500,
 'easeInSine');
 }
 function leave() {
 $(this).stop().animate(
 {
 left: '-1024px',
 backgroundColor: 'rgb(255,211,224)'
 },
 1500,
 'easeOutBounce');
 }
 }); // end ready
 }*/