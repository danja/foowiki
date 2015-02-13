// Node.js periodic backup of store Turtle


var http = require('http'); 

// http://localhost:3030/foowiki/page.html?uri=http://hyperdata.it/wiki/Test%20Two

// http://localhost:3030/foowiki/sparql?query=CONSTRUCT+%7B+%3Fs+%3Fp+%3Fo+%7D++WHERE+%7B%0D%0A+++GRAPH+%3Chttp%3A%2F%2Fhyperdata.it%2Fwiki%3E+%7B%0D%0A++++++%3Fs+%3Fp+%3Fo%0D%0A+++%7D%0D%0A%7D&output=text

function startKeepAlive() {
    setInterval(function() {
        var options = {
            host: 'localhost',
            port: 3030,
            path: '/foowiki/sparql?query=CONSTRUCT+%7B+%3Fs+%3Fp+%3Fo+%7D++WHERE+%7B%0D%0A+++GRAPH+%3Chttp%3A%2F%2Fhyperdata.it%2Fwiki%3E+%7B%0D%0A++++++%3Fs+%3Fp+%3Fo%0D%0A+++%7D%0D%0A%7D&output=text'
        };
        
        console.log("Getting...");
        http.get(options, function(res) {
            var all = "";
            res.on('data', function(chunk) {
                try {
                    all = all + chunk;
                    // optional logging... disable after it's working
             // console.log("chunk: " + chunk);
                } catch (err) {
                    console.log(err.message);
                }
            });
                        res.on('end', function() {
                try {
                    console.log("RESPONSE: " + all);
                } catch (err) {
                    console.log(err.message);
                }
            });
        }).on('error', function(err) {
            console.log("Error: " + err.message);
        });
    }, 1 * 60 * 1000); // load every x minutes
}

function saveToFile(data) {
}

function postToStore(data) {
}

startKeepAlive();