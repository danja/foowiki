/**
 * Functions associated with page.html
 */

function getImage(imageURI, callback) {
    console.log("AAA imageURI=" + imageURI);
    var pageMap = {
        "imageURI": imageURI,
        "graphURI": graphURI
    };

    var getPageSparql = sparqlTemplater(getImageSparqlTemplate, pageMap);
    var getPageUrl = sparqlQueryEndpoint + encodeURIComponent(getPageSparql) + "&output=xml";

    var makeDataURL = function (entryJSON) {
     //   console.log("BBB");
     //   var entryXmlNames = ["base64"];
        // var entryJSON = sparqlXMLtoJSON(xml);
        var src = "data:image/jpeg;base64," + entryJSON[0]["base64"];
        callback(src);
    }
    console.log("getPageUrl=" + getPageUrl);
    getDataForURL(makeDataURL, getPageUrl);
}

function getPage(pageURI, entryHandler) {

    // http://localhost:3030/foowiki/page.html?uri=http://hyperdata.it/wiki/1unnamed.jpg&type=image
    if (queryString["type"] == "image") {
        var fliptoImage = function (src) {
            window.location.href = src;
        };
        getImage(pageURI, fliptoImage);
        return;
    }
    //   pageURI = encodeURI(pageURI);
    console.log("CCCimageURI=" + pageURI);

    var pageMap = {
        "pageURI": pageURI,
        "graphURI": graphURI
    };

    var getPageSparql = sparqlTemplater(getPageSparqlTemplate, pageMap);
    var getPageUrl = sparqlQueryEndpoint + encodeURIComponent(getPageSparql) + "&output=xml";

    var handleEntry = function (entryJSON) {
        entryHandler(pageMap, entryJSON);
    };

    getDataForURL(handleEntry, getPageUrl);
}

function buildPage(pageMap, entryJSON) {
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
    // console.log("entryJSON[0] = " + JSON.stringify(entryJSON[0]));
    entry["uri"] = "page.html?uri=" + entry["pageURI"];
    
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

    var entryObject = $(formatEntry(entry));
  //  fixImageLinks(entryObject);
    translateLinks(entryObject);
    //  $("#entry").replaceWith(entryHTML);
    $("#entry").replaceWith(entryObject);
    //  translateLinks();
    fixHeaderIDs(); // little workaround for odd marked.js behaviour
    
    setupTags("#maintagscontainer", pageMap, true);
    setupSearch("#searchContainer");
}

function formatEntry(entry) {
    //  entry.content = unescapeLiterals(entry.content);

    //   entry.content = tweakBlockquotes(entry.content);
    //  entry.content = marked(entry.content);

    entry.content = formatContent(entry.content);

    // console.log("entry.content = " + entry.content);
    entry.date = moment(entry.date).format("dddd, MMMM Do YYYY, h:mm:ss a");
    return templater(pageEntryTemplate, entry);
}

function formatContent(content) {
    content = unescapeLiterals(content);
    content = tweakBlockquotes(content);
    content = marked(content);
    return content;
}

/*
function fixImageLinks(object) {

    $("img", object).each(function () {
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
*/