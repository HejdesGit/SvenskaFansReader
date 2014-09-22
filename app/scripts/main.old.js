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

    // Data and done callbacks
    var dataCallback = function (data) {

        //console.log("Data received", data);
        dance:
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                if (posts !== null && typeof(posts[today]) !== 'undefeined') {
                    for (var key in posts[today]) {
                        if (posts[today][key].post == data[i].data.post) {
                            break dance;
                        }
                    }
                }
                // for (var k in d.data) {
                //     document.write("<i>" + k + "</i>: " + d.data[k] + "<br />");
                //}
                //document.write("<hr>");

                _.each(data[i].data, function (value, key) {
                    key = key.replace('/', '');
                    b[key] = value;
                });
                wrieteFirebase(b);
            }
    };
    var doneCallback = function (data) {
        console.log("doneCallback -- Wating next round ---");
        window.setTimeout(function() {queryFirebase()}, 10000);
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

    queryFirebase();


});

Date.prototype.yyyymmdd = function () {

    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();

    return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);
};
