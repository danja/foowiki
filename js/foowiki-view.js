/**
 * Functions associated with page.html
 */

function getImage(imageURI, callback) {
    var pageMap = {
        "imageURI": imageURI,
        "graphURI": graphURI
    };

    var getPageSparql = templater(getImageSparqlTemplate, pageMap);
    var getPageUrl = sparqlQueryEndpoint + encodeURIComponent(getPageSparql) + "&output=xml";

    var doneCallback = function (xml) {
        var entryXmlNames = ["base64"];
        var entryJSON = sparqlXMLtoJSON(xml, entryXmlNames);
        var src = "data:image/jpeg;base64," + entryJSON[0]["base64"];
        callback(src);
    }
    getDataForURL(doneCallback, getPageUrl);
}

function getPage() {
    var pageURI = queryString["uri"];

    console.log("queryString = " + JSON.stringify(queryString));
    if (queryString["type"] == "image") {
        var callback = function (src) {
            window.location.href = src;
        };
        return getImage(pageURI, callback);
    }
    pageURI = encodeURI(pageURI);

    var pageMap = {
        "pageURI": pageURI,
        "graphURI": graphURI
    };

    var getPageSparql = templater(getPageSparqlTemplate, pageMap);
    var getPageUrl = sparqlQueryEndpoint + encodeURIComponent(getPageSparql) + "&output=xml";

    var doneCallback = function (xml) {

        var entryJSON = sparqlXMLtoJSON(xml, entryXmlNames);

        if (!entryJSON) {
            entryJSON = {
                content: "",
                date: "",
                title: "",
                nick: ""
            };
            window.location.href = window.location.href.replace("page.html", "edit.html");
        }

        var entry = entryJSON[0];
        entry["uri"] = "page.html?uri=" + pageURI;
        // check if it's code-like
        if (preformatFormats.contains(entry.format)) {
            entry.content = "<pre>" + entry.content + "</pre>";
        }

        // check if it's runnable
        if (runnableFormats.contains(entry.format)) {

            var runButton = $("<button>");
            $("#buttons").append(runButton);
            runButton.attr("id", "runButton");
            runButton.text("Run");
            $("#runButton").click(function () {
                window.location.href = window.location.href.replace("page.html", "run.html");
                return false;
            });
        };

        var entryHTML = formatEntry(entry);

        $("#entry").replaceWith(entryHTML);
        translateLocalLinks();
        fixHeaderIDs(); // little workaround for odd marked.js behaviour
        fixImageLinks(pageMap);
        setupTags("#maintagscontainer", pageMap, true);
        setupSearch("#searchContainer");
    };

    getDataForURL(doneCallback, getPageUrl);
}

function formatEntry(entry) {
       //      entry.content = unescapeLiterals(entry.content);
    
    entry.content = tweakBlockquotes(entry.content);
    entry.content = marked(entry.content);

    // console.log("entry.content = " + entry.content);
    entry.date = moment(entry.date).format("dddd, MMMM Do YYYY, h:mm:ss a");
    return templater(pageEntryTemplate, entry);
}

function fixImageLinks(pageMap) {

    $("img").each(function () {
        //  var split = window.location.href.split("/");
        //    var path = split.slice(0, split.length - 1).join("/");
        //     path = path + "/" + $(this).attr("src") + "&type=image";
        // $(this).attr("src", path);
        var path = pagesBaseURI + $(this).attr("src");
        var me = this;
        var callback = function (src) {
            //   console.log("SRC="+src);
            $(me).attr("src", src);
        }
        getImage(path, callback);
    });
}