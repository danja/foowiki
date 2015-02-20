/**
 * Functions associated with edit.html
 */



function setupPosting() {
    $('#cancel').click(function () {
        return flipToViewPage();
    });

    $('#submit').click(function () {
    storeEntry();
    });
    
    var storeEntry = function() {
            var entry = extractEntry(graphURI, uri);
        var data = sparqlTemplater(postPageSparqlTemplate, entry, true);

        //     var afterPostEntry = function () {

        //   }

        var postNewData = function () {
            $.ajax({
                type: "POST",
                url: sparqlUpdateEndpoint,
                data: ({
                    update: data
                })
            }).done(function () {
                var fliptoViewPage = function () {
                    window.location.href = window.location.href.replace("edit.html", "page.html");
                };
                submitOutlinks(graphURI, uri, entry.content);
                submitTags(graphURI, uri, fliptoViewPage);
                //   callback();
            });
        }
        deletePage(graphURI, uri, postNewData);
        return false;
    }
    
    var flipToViewPage = function() {
        window.location.href = window.location.href.replace("edit.html", "page.html");
        return false;
    }

     var fliptoIndexPage = function () {
            window.location.href = "index.html";
        };
     
    $('#delete').click(function () {
       
        return deletePage(graphURI, uri, fliptoIndexPage);
    });
}

function extractEntry(graphURI, uri) {
    console.log("ENTRY = " + JSON.stringify(entry));
    var entry = {
        "graphURI": graphURI,
        "uri": uri,
        "date": (new Date()).toISOString(),
        "modified": (new Date()).toISOString()
    };
    entry.title = $('#title').val(); /// can this lot use a convention, HTML id = entry field name??? idHtmlToJSON??
    entry.nick = $('#nick').val();
    entry.created = $('#created').text();
    entry.content = $('#content').val();
    entry.content = escapeXml(entry.content);
    entry.format = $('#format').val();

    return entry;
}

function deletePage(graphURI, uri, callback) {
    var map = {
        "uri": uri,
        "graphURI": graphURI
    };
    var data = sparqlTemplater(deletePageSparqlTemplate, map, true);
    $.ajax({
        type: "POST",
        url: sparqlUpdateEndpoint,
        data: ({
            update: data
        })
    }).done(function () {
        callback();
    });
    return false;
}

function submitOutlinks(graphURI, uri, content) {
    var matches = content.match(/\[([^\[]*)\]\(([^\)]*)\)/g);
    console.log("MATCHESreg=" + JSON.stringify(matches));
}

// TAGS ----------------------------------------------
function submitTags(graphURI, uri, callback) {

    var tagsCommas = $("#maintagscontainer").tagit("assignedTags");
    console.log("tagsCommas=" + tagsCommas);
    var tagStrings = tagsCommas; //.split(",");
    var tags = [];
    for (var i = 0; i < tagStrings.length; i++) {
        var tag = {
            "topicURI": "http://hyperdata.it/tags/" + tagStrings[i].toLowerCase(),
            "topicLabel": tagStrings[i].toLowerCase()
        };
        tags.push(tag);
    }

    var templateMap = {
        "graphURI": graphURI,
        "uri": uri,
        "tags": tags
    };

    //    console.log("templateMap=" + JSON.stringify(templateMap));
    var data = sparqlTemplater(postTagsSparqlTemplate, templateMap, true);
    //     console.log("postTagsSparqlTemplate=" + postTagsSparqlTemplate);
    //     console.log("DATA=" + data);

    $.ajax({
        type: "POST",
        url: sparqlUpdateEndpoint,
        data: ({
            update: data
        })
    }).done(function () {
        callback();
    });
}