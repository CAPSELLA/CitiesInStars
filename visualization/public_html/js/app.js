'use strict';
var myApp = angular.module('myApp', ['ngRoute', 'ngSanitize','ngAnimate', 'map']).config(function ($routeProvider, $locationProvider, $sceDelegateProvider) {
    $routeProvider.when('/explore', {
        templateUrl: 'partials/explore.html',
        controller: 'topicModelingController'
    });
    $routeProvider.when('/explore/:id', {
        templateUrl: 'partials/explore.html',
        controller: 'topicModelingController'
    });
    $routeProvider.when('/stats', {
        templateUrl: 'partials/stats.html',
        controller: 'statisticsController'
    });
    $routeProvider.when('/search', {
        templateUrl: 'partials/search.html',
        controller: 'exploreDataSourcesController'
    });
    $routeProvider.when('/searchTwitter', {
        templateUrl: 'partials/searchTwitter.html',
        controller: 'exploreDataSourcesTwitterController'
    });
    $routeProvider.when('/twitterStatistics', {
        templateUrl: 'partials/twitterStatistics.html',
        controller: 'twitterStatisticsController'
    });
    $routeProvider.when('/landingPage', {
        templateUrl: 'partials/landingPage.html',
        controller: 'landingPageController'
    });
    $routeProvider.otherwise({
        //redirectTo: '/explore'
        redirectTo: '/landingPage'
    });
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://*.ilsp.gr/**',
        'https://*.ilsp.gr/**',
        'http://*.ilsp.gr:29927/**',
        'https://*.ilsp.gr:29927/**',
        'http://*.ilsp.gr/**',
        'https://*.ilsp.gr/**',
        'http://*.ilsp.gr:29927/**',
        'https://*.ilsp.gr:29927/**',
        'http://*.ilsp.gr:29928/**',
        'http://*.ilsp.gr:29928/**'
    ]);
    $locationProvider.html5Mode(false);
});
angular.module('map', []);
myApp.factory('sharedDataFoursquare', function () {
    var dataObj = [
        {name: 'Athens', comments: 4656, 'pois': 5432},
        {name: 'Paris', comments: 31802, 'pois': 17250},
        {name: 'London', comments: 122433, 'pois': 16888},
        {name: 'Amsterdam', comments: 4824, 'pois': 3851},
        {name: 'Berlin', comments: 29386, 'pois': 6998},
        {name: 'Rome', comments: 523, 'pois': 5882},
        {name: 'Barcelona', comments: 7920, 'pois': 6595},
        {name: 'Lisbon', comments: 0, 'pois': 3519},
        {name: 'Brussels', comments: 2196, 'pois': 5428},
        {name: 'Prague', comments: 12342, 'pois': 4600}
    ];
    return dataObj;
});

myApp.factory('sharedDataTwitter', function () {
    var dataObj = [
        {name: 'Athens', tweets: 15370},
        {name: 'Paris', tweets: 77618},
        {name: 'London', tweets: 421885},
        {name: 'Amsterdam', tweets: 41247},
        {name: 'Berlin', tweets: 46665},
        {name: 'Rome', tweets: 57560},
        {name: 'Barcelona', tweets: 33852},
        {name: 'Lisbon', tweets: 17486},
        {name: 'Brussels', tweets: 35072},
        {name: 'Prague', tweets: 7782}
    ];
    return dataObj;
});

myApp.factory('sharedCoordinates', function () {
    var dataObj = [
        {name: 'London',
            center: {lat: 51.50735, lon: -0.1277583},
            box: {
                southWest: {lat: 51.057, lon: -0.8502},
                northEast: {lat: 51.957, lon: 0.5946}
            }
        },
        {name: 'Rome',
            center: {lat: 41.902782, lon: 12.352222},
            box: {
                southWest: {lat: 41.812, lon: 12.3755},
                northEast: {lat: 41.992, lon: 12.6171}
            }
        },
        {name: 'Paris',
            center: {lat: 48.856613, lon: 2.352222},
            box: {
                southWest: {lat: 48.406, lon: 1.6687},
                northEast: {lat: 49.306, lon: 3.0356}
            }
        },
        {name: 'Barcelona',
            center: {lat: 41.385063, lon: 12.496366},
            box: {
                southWest: {lat: 41.295, lon: 2.0535},
                northEast: {lat: 41.474, lon: 2.2932}
            }
        },
        {name: 'Brussels',
            center: {lat: 50.850346, lon: 4.3517213},
            box: {
                southWest: {lat: 50.760, lon: 4.2092},
                northEast: {lat: 50.940, lon: 4.4941}
            }
        },
        {name: 'Prague',
            center: {lat: 50.07554, lon: 14.4378},
            box: {
                southWest: {lat: 49.985, lon: 14.2976},
                northEast: {lat: 50.165, lon: 14.5779}
            }
        },
        {name: 'Athens',
            center: {lat: 37.98381, lon: 23.72754},
            box: {
                southWest: {lat: 37.920, lon: 23.6476},
                northEast: {lat: 38.046, lon: 23.8074}
            }
        },
        {name: 'Berlin',
            center: {lat: 52.520008, lon: 13.404954},
            box: {
                southWest: {lat: 52.430, lon: 13.2571},
                northEast: {lat: 52.609, lon: 13.5527}
            }
        },
        {name: 'Lisbon',
            center: {lat: 38.72225, lon: -9.139337},
            box: {
                southWest: {lat: 38.659, lon: -9.2200},
                northEast: {lat: 38.785, lon: -9.0586}
            }
        },
        {name: 'Amsterdam',
            center: {lat: 52.370216, lon: 4.895168},
            box: {
                southWest: {lat: 52.280, lon: 4.7478},
                northEast: {lat: 52.460, lon: 5.0424}
            }
        }
    ];
    return dataObj;
});

