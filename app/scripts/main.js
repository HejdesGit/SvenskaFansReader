$(function () {
    importio.init({
        "auth": {
            "userGuid": "5767c7c2-3c74-4ad2-b9d8-cf80b854967e",
            "apiKey": "tOCBC2IzV1hZDBOMCPaSsX5D3uXs+a3inLbSVFMMDqBlPQ8gXNcdCUTo/29Tw5mO/yRVXD/lzVQNre3qc5dPHQ=="
        },
        "host": "import.io"
    });

    // Data and done callbacks
    var dataCallback = function (data) {
        console.log("Data received", data);
        for (var i = 0; i < data.length; i++) {
            //var d = data[i];
            var b = {};

            _.each(data[i].data, function(value, key) {
                key = key.replace('/','');
                b[key] = value;
            });
            wrieteFirebase(b);
            //for (var k in d.data) {
            //    document.write("<i>" + k + "</i>: " + d.data[k] + "<br />");
            //}
            //document.write("<hr>");
        }
    };
    var doneCallback = function (data) {
        console.log("Done, all data:", data);
        document.write("<b>Done</b><hr>");
    };

// 3. Do the query (when the function is called)
    var doQuery = function () {
        // Query for tile sVENSKAFANSrEADER
        importio.query({
            "connectorGuids": [
                "a21112a0-1108-4888-8d14-bb7bcb8cb0c1"
            ],
            "input": {
                "webpage/url": "http://www.svenskafans.com/fotboll/mff/forum.aspx?tnl336Click=fotboll&tnl336Tab=FrmPop"
            }
        }, {"data": dataCallback, "done": doneCallback});
    };
    doQuery();

    var wrieteFirebase = function (data) {
        var myFirebaseRef = new Firebase("svenskafansreader.firebaseio.com");
        myFirebaseRef.push(data, function (error) {
            if (error) {
                console.log("Data could not be saved." + error);
            } else {
                console.log("Data saved successfully.");
            }
        });
    };

    //wrieteFirebase();
});

