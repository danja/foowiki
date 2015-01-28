/**
 * Functions associated with edit.html  
 */

function setupPosting() {
    $('#cancel').click(function () {
        window.location.href = window.location.href.replace("edit.html", "page.html");
        return false;
    });

    $('#submit').click(function () {
        var entry = {
            "graphURI": graphURI,
            "pageURI": pageURI,
            "date": (new Date()).toISOString()
        };
        entry.title = $('#title').val();
        entry.nick = $('#nick').val();
        entry.content = $('#content').val();
        entry.content = escapeXml(entry.content);
        entry.format = $('#format').val();

        var data = templater(postPageSparqlTemplate, entry);

        // put current data in local storage here
        var callback = function () {
            $.ajax({
                type: "POST",
                url: sparqlUpdateEndpoint,
                data: ({
                    update: data
                })
            }).done(function () {
                var callback = function () {
                    window.location.href = window.location.href.replace("edit.html", "page.html");
                };
                submitTags(graphURI, pageURI, callback);
                //   callback();
            });
        }

        deletePage(graphURI, pageURI, callback);
        return false;
    });

    $('#delete').click(function () {
        var callback = function () {
            window.location.href = "index.html";
        }
        return deletePage(graphURI, pageURI, callback);
    });
}

// TAGS ----------------------------------------------
function submitTags(graphURI, pageURI, callback) {

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
        "pageURI": pageURI,
        "tags": tags
    };

    //    console.log("templateMap=" + JSON.stringify(templateMap));
    var data = templater(postTagsSparqlTemplate, templateMap);
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


function deletePage(graphURI, pageURI, callback) {
    var map = {
        "pageURI": pageURI,
        "graphURI": graphURI
    };
    var data = templater(deletePageSparqlTemplate, map);
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