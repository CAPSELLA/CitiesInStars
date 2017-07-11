'use strict';
function activeClass(activeClassID, inactiveClassID) {
    $(activeClassID).addClass("active");
    for (var i = 0; i < inactiveClassID.length; i++) {
        $(inactiveClassID[i]).removeClass("active");
    }
}

/*
function f($scope) {
    var data = {"date_from": '',
        "date_to": '',
        "terms": ['obesity', 'horse'],
        "source": 'twitter',
        "crawler": 'Athens, Greece'
    };

    var datajson = JSON.stringify(data);
    var url = 'http://dataservices.ilsp.gr:29928/search_terms';
    alert('before making search query f, ' + datajson);
    $.support.cors = true;
    $.ajax({
        crossDomain: true,
        url: url,
        type: "POST",
        data: datajson,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            alert('success query f Terms');
            alert(JSON.stringify(response));
            console.log(response);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error while comunicating with the API. f terms");
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
            console.log("____");
            console.log(JSON.stringify(xhr));
            console.log(JSON.stringify(ajaxOptions));
            console.log(JSON.stringify(thrownError));
        }
    });
}*/

function makeRequestAPI_searchTerm($scope) {
    var data = {
        "date_from": '',
        "date_to": '',
        "terms": ['obesity', 'horse'],
        // "terms"     :['healthy'],
        "source": 'foursquare', //'twitter', //'η foursquare αντίστοιχα
        "crawler": 'Athens, Greece'
    };

    var datajson = JSON.stringify(data);
    var url = 'http://dataservices.ilsp.gr:29928/search_terms';
    alert('before making query makeRequestAPI_searchTerm');
    $.ajax({
        url: url,
        type: "POST",
        data: datajson,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            alert('success query Terms');
            alert(JSON.stringify(response));
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error while comunicating with the API. query terms");
        }
    });
}


function makeRequestAPI_countTweets($scope, date_from, date_to) {
    var data = {
        //"date_from": '2016-12-01',
        //"date_to": '2016-12-30'
        "date_from": date_from,
        "date_to": date_to
    };
    var datajson = JSON.stringify(data);
    var url = 'http://dataservices.ilsp.gr:29928/count_data/tweets';
    $.ajax({
        url: url,
        type: "POST",
        data: datajson,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            //alert('success count tweets');
            //alert(JSON.stringify(response));
            //alert(datajson);
            $scope.updateTwitterComments(response);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error while comunicating with the API. count tweets");
        }
    });
}

/*
 function makeRequestAPI_getTweets($scope) {
 var data = {
 "date_from": '',
 "date_to": '',
 'skip': 100,
 'size': 100,
 "crawler": 'Athens, Greece'
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
 alert('success get tweets');
 alert(JSON.stringify(response));
 },
 error: function (xhr, ajaxOptions, thrownError) {
 alert("Error while comunicating with the API. get tweets");
 }
 });
 }*/

/*
function makeRequestAPI_getTopicsTextsFoursquare($scope) {
    var data = {
        //"ids": ['fsq_AVlkENFYUKUEY4dTmQXI', 'fsq_AVlkENG2UKUEY4dTmQXR', 'fsq_AVlkENbYUKUEY4dTmQX6', 'fsq_AVlkEQcuUKUEY4dTmQec', 'fsq_AVlkESSfUKUEY4dTmQhP']
        "ids": ['fsq_AVnY0SKf9Rk57rBJYelk', 'fsq_AVnW9Om-9Rk57rBJYGrT', 'fsq_AVnWb0RY9Rk57rBJYAdW', 'fsq_AVnWl62M9Rk57rBJYCcu', 'fsq_AVnWb9Xr9Rk57rBJYArp', 'fsq_AVnWl62B9Rk57rBJYCcq']
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
            alert('success get makeRequestAPI_getTopicsTexts');
            alert(JSON.stringify(response));
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error while comunicating with the API. get makeRequestAPI_getTopicsTexts");
        }
    });
}*/

/*
function makeRequestAPI_getTopicsTextsTwitter($scope) {
    var data = {
        "ids": ['tweetsAVllYYq8McVkNEbRphL0', 'tweetsAVllZ4JrMcVkNEbRpjgx', 'tweetsAVllZyGrMcVkNEbRpjWT', 'tweetsAVllZyGrMcVkNEbRpjWN', 'tweetsAVllZyGrMcVkNEbRpjWL', 'tweetsAVllZyGrMcVkNEbRpjWJ']
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
            alert('success get makeRequestAPI_getTopicsTextsTwitter');
            alert(JSON.stringify(response));
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error while comunicating with the API. get makeRequestAPI_getTopicsTextsTwitter");
        }
    });
}*/

function makeRequestAPI_countFoursquareComments($scope, date_from, date_to) {
    var data = {
        "date_from": date_from,
        "date_to": date_to
    };
    var datajson = JSON.stringify(data);
    var url = 'http://dataservices.ilsp.gr:29928/count_data/foursquare';
    $.ajax({
        url: url,
        type: "POST",
        data: datajson,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            //alert('success makeRequestAPI_countFoursquareComments');
            $scope.updateFoursquareComments(response);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Error while communicating with the API. makeRequestAPI_countFoursquareComments");
            $scope.updateFoursquareComments([]);
        }
    });
}


 