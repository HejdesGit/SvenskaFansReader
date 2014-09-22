$(function () {
    importio.init({
        "auth": {
            "userGuid": "5767c7c2-3c74-4ad2-b9d8-cf80b854967e",
            "apiKey": "tOCBC2IzV1hZDBOMCPaSsX5D3uXs+a3inLbSVFMMDqBlPQ8gXNcdCUTo/29Tw5mO/yRVXD/lzVQNre3qc5dPHQ=="
        },
        "host": "import.io"
    });

    var posts;
    var b = {};
    var d = new Date();
    var today = d.yyyymmdd();
    var prepend = true;
    var first;
    var l = Ladda.create(document.querySelector('.ladda-button'));
    var myVar;
    var quote;
    var hasQuote;

    // Data and done callbacks
    var dataCallback = function (data) {
        //console.log("Data received", data);
        dance:
            for (var i = 0; i < data.length; i++) {
                if (data[i].data.post != null) {
                    hasQuote = false;
                    var text = '';
                    if (i === 0) {
                        first = true;
                    }
                    else {
                        first = false;
                    }
                    var d = data[i];
                    for (var key in posts) {
                        if (posts[key].data.post == data[i].data.post) {
                            break dance;
                        }
                    }
                    for (var k in d.data) {

                        switch (k) {
                            case "shirt":
                                text += '<img src="' + d.data[k] + '"></img><br />';
                                break;
                            case 'shirt/_alt' || 'shirt/_title':
                                break;
                            case 'quote':
                                text += '<i>' + k + '</i>: <article class="quoteQuote">' + d.data[k] + '</article><br />';
                                quote = d.data[k];
                                hasQuote = true;
                                break;
                            case 'post':
                                if(hasQuote){
                                    var textData = d.data[k];
                                    textData = textData.replace(quote, '');
                                    text += '<i>' + k + '</i>: <article class="postQuote">' + textData + '</article><br />';
                                }else{
                                    text += "<i>" + k + "</i>: " + d.data[k] + "<br />";
                                }
                                break;
                            default:
                                text += "<i>" + k + "</i>: " + d.data[k] + "<br />";


                        }
                    }
                    if (first === true) {
                        text += '<div style="height:10px;background-color: red;"></div>';
                    }
                    var text2 = '<post>' + text + '</post>';
                    if (prepend) {
                        $('.container').prepend(text2);
                        $('.container').prepend("<hr>");
                    } else {
                        $('.container').append(text2);
                        $('.container').append("<hr>");
                    }
                }
            }
    };
    var doneCallback = function (data) {
        prepend = false;
        posts = data;
        console.log("doneCallback -- Wating next round ---");
        myVar = setTimeout(function () {
            doQuery()
        }, 10000);
        l.stop();
        $('.js-more-posts').removeClass("hide");
        myVar();
    };

// 3. Do the query (when the function is called)
    var doQuery = function () {
        // Query for tile sVENSKAFANSrEADER
        importio.query({
            "connectorGuids": [
                "a21112a0-1108-4888-8d14-bb7bcb8cb0c1"
            ],
            "input": {
                "webpage/url": "http://www.svenskafans.com/fotboll/mff/forum.aspx"
                //?page=2
            }
        }, {"data": dataCallback, "done": doneCallback});
    };


    var wrieteFirebase = function (data) {
        var myFirebaseRef = new Firebase("svenskafansreader.firebaseio.com");
        myFirebaseRef.child(today).push(data, function (error) {
            if (error) {
                console.log("Data could not be saved." + error);
            } else {
                console.log("Data saved successfully: " + data);
            }
        });
    };


    var queryFirebase = function () {
        var myFirebaseRef = new Firebase("svenskafansreader.firebaseio.com");
        var query = myFirebaseRef.limit(100);
        query.on('value', function (query2) {
            var postInfo = query2.val();
            posts = postInfo;
            doQuery();
        });

    };

    //queryFirebase();
    doQuery();

    $('.js-more-posts').click(function () {
        // var l = Ladda.create( document.querySelector( 'button' ) );
        // l.start();
        // l.stop();
        // l.toggle();
        // l.isLoading();
        // l.setProgress( 0-1 );
        l.start();
        clearTimeout(myVar);
        prepend = true;
        var page = $('.js-more-posts').data('page');
        $('.container').prepend('<div style="background-color: green;">Page: ' + page + '</div>');
        importio.query({
            "connectorGuids": [
                "a21112a0-1108-4888-8d14-bb7bcb8cb0c1"
            ],
            "input": {
                "webpage/url": "http://www.svenskafans.com/fotboll/mff/forum.aspx?page=" + page
                //?page=2
            }
        }, {"data": dataCallback, "done": doneCallback});
        $('.js-more-posts').data('page', page + 1);
    });

});

Date.prototype.yyyymmdd = function () {

    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();

    return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);
};
