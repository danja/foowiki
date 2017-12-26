/**
 * Functions associated with page.html
 */





/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function buildPage(pageMap, entryJSON) {
  // console.log("in build page "+JSON.stringify(entryJSON))
    if (!entryJSON || (entryJSON == "{}")) {
        entryJSON = { // is needed?
            content: "",
            created: "",
            modified: "",
            title: "",
            nick: ""
        };
        // TO DO - put an 404 page handler here?? for static rendition?
      //  window.location.href = window.location.href.replace("page-static.html", "edit.html");
        return;
    }

    var entry = entryJSON[0];
    // console.log("entryJSON[0] = " + JSON.stringify(entryJSON[0]));
    entry["uri"] = "page-static.html?uri=" + entry["uri"];

    // check if it's code-like
    if (FooWiki.preformatFormats.contains(entry.format)) {
        entry.content = "<pre>" + entry.content + "</pre>";
    }

    // check if it's runnable
    if (FooWiki.runnableFormats.contains(entry.format)) {

        var runButton = $("<button>");
        $("#buttons").append(runButton);
        runButton.attr("id", "runButton");
        runButton.text("Run");
        $("#runButton").click(function () {
            window.location.href = window.location.href.replace("page-static.html", "run.html");
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

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function formatEntry(entry) {
    //  entry.content = unescapeLiterals(entry.content);

    //   entry.content = tweakBlockquotes(entry.content);
    //  entry.content = marked(entry.content);

    entry.content = formatContent(entry.content);

    // console.log("entry.content = " + entry.content);
    entry.date = moment(entry.date).format("dddd, MMMM Do YYYY, h:mm:ss a");
    var templated = templater(pageEntryTemplate, entry);
    // console.log("TEMPLATED = "+templated)
    return templated;
}

/**
 * Comment template.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */
function formatContent(content) {
    content = unescapeLiterals(content);
    content = tweakBlockquotes(content);
  //  console.log("CONTENT1 = "+content)
    content = marked(content);
//    console.log("CONTENT2 = "+content)
    return content;
}

/*
function fixImageLinks(object) {

    $("img", object).each(function () {
        //  var split = window.location.href.split("/");
        //    var path = split.slice(0, split.length - 1).join("/");
        //     path = path + "/" + $(this).attr("src") + "&type=image";
        // $(this).attr("src", path);
        var path = FooWiki.FooWiki.pagesBaseURI + $(this).attr("src");
        var me = this;
        var callback = function (src) {
            //   console.log("SRC="+src);
            $(me).attr("src", src);
        }
        getImage(path, callback);
    });
}
*/
