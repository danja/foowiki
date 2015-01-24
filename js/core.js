 function getDataForURL(doneCallback, getPageURL) {
     $.ajax({
         url: getPageURL,
         accept: {
             xml: 'application/xml;charset=UTF-8',
             sparql: 'sparql-results+xml;charset=UTF-8'
         },
         headers: { // belt and braces
             'Accept': 'sparql-results+xml;charset=UTF-8'
             //   'Accept-Charset': 'UTF-8' unsafe
         }

     }).done(function (xml) {
         var pageURI = queryString["uri"];
         pageURI = encodeURI(pageURI);
         doneCallback(xml, pageURI);
     });
 }

 function sparqlXMLtoJSON(xml, bindingNames) {

     var xmlString = (new XMLSerializer()).serializeToString(xml);

     // workaround for wrong interpretation of charset
     xmlString = xmlString.replace(/[^\u0000-\u007F]/g, '');
     // maybe force to ISO-8859-1, also known as Latin-1 instead?

     var $xml = $(xmlString);
     //  var entry = {
     //      "uri": "page.html?uri=" + pageURI
     //  };

     var results = $xml.find("result");

     if (results.length == 0) {
         return false;
     }

     var jsonResults = [];

     results.each(function () {
         var map = {};
         for (var i = 0; i < bindingNames.length; i++) {
             var name = bindingNames[i];
             //     console.log("NAME=" + name);
             $(this).find("binding[name='" + name + "']").each(function () {
                 //  entry[name] = $(this).text().trim();
                 // console.log("entry[name]=" + entry[name]);
                 map[name] = $(this).text().trim();
             });
         }
         jsonResults.push(map);
     });
     return jsonResults;
 }


 function setupTags(containerId, pageMap, readOnly) {
     if (readOnly) {
         createTags(containerId, pageMap, readOnly);
     } else {
         setupTagsAutocomplete(containerId, function () {
             createTags(containerId, pageMap, readOnly);
         });
     }
 }

 function setupSearch(searchContainer) {

   //  $(searchContainer).append("<button id='searchButton'>Search</button>");
   //  $(searchContainer).append(entryTableTemplate);

     var doneCallback = function (xml) {
         var tags = tagsXmlToJson(xml);
         var tagButtons = $(searchContainer + " #tagButtons");

         for (var i = 0; i < tags.length; i++) {
             var uri = tags[i]["topicURI"];
             var label = tags[i]["topicLabel"];
             //  <input type="checkbox" id="check1"><label for="check1">B</label>
             $(tagButtons).append("<input type='checkbox' id='tagButton" + i + "' name='" + label + "'><label for='tagButton" + i + "'>" + label + "</label> ");
         }
         $(tagButtons).buttonset();

         $("#searchButton").click(function () {
             doSearch();
         });
     }
     getAllTags(doneCallback);
 }

 function doSearch() {
     console.log("doSearch");
     var regex = $("#searchText").val();

     console.log("regex = " + regex);

     var searchMap = {
         "graphURI": graphURI,
         "regex": regex
     };

     $.extend(searchMap, entryXmlNames); // merges maps

     var checkedTags = [];

     $("#tagButtons label").each(function () {
         if ($(this).hasClass("ui-state-active")) {
             console.log("Checked = " + $(this).text());
             var checkedTag = {
                 "topicLabel": $(this).text()
             };
             checkedTags.push(checkedTag);
         }
     });

     searchMap["tags"] = checkedTags;

     console.log("searchMap = " + JSON.stringify(searchMap));

     var searchSparql = templater(searchSparqlTemplate, searchMap);
     var searchUrl = sparqlQueryEndpoint + encodeURIComponent(searchSparql) + "&output=xml";

     var doneCallback = function (xml) {
         //    console.log("entriesJSON = " + JSON.stringify(entriesJSON));
         var results = makeResultsHTML(xml);
         $("results").empty();
         $("#results").append(results);
     }
     getDataForURL(doneCallback, searchUrl);
 }

 // for search results
 function makeResultsHTML(xml) {
     var links = "";
     var entryArray = sparqlXMLtoJSON(xml, entryXmlNames);
     //xmlToEntryArray(xml);
     for (var i = 0; i < entryArray.length; i++) {
         var entry = entryArray[i];
         entry.uri = "page.html?uri=" + entry.uri;
        
         links += templater(linkTemplate, entry);
     }
     return links;
 }

 // for index page
 function makeEntryListHTML(xml, showContent) {
     var rows = "";
     var entryArray = sparqlXMLtoJSON(xml, entryXmlNames);
     //xmlToEntryArray(xml);
     for (var i = 0; i < entryArray.length; i++) {
         rows += formatRow(entryArray[i]); // content, 
     }
     return rows;
 }

 function formatRow(entry) { // content, 
     entry.uri = "page.html?uri=" + entry.uri;
     entry.date = moment(entry.date).format("dddd, MMMM Do YYYY, h:mm:ss a");
     var row = templater(rowTemplate, entry);
     return row;
 }


 function setupTagsAutocomplete(tagsContainerId, callback) {
     var doneCallback = function (xml) {
         var tags = tagsXmlToJson(xml);
         var allTags = [];

         for (var i = 0; i < tags.length; i++) {
             var label = tags[i]["topicLabel"];
             allTags.push(label);
         }

         var tagitMap = {
             readOnly: false,
             autocomplete: {
                 delay: 0,
                 minLength: 1
             },
             availableTags: allTags
         };
         $(tagsContainerId).tagit(tagitMap);
         callback();
     }
     getAllTags(doneCallback);
 }

 function tagsXmlToJson(xml) {
     var xmlString = (new XMLSerializer()).serializeToString(xml);
     var tagsXmlNames = ["topicURI", "topicLabel"];
     return sparqlXMLtoJSON(xml, tagsXmlNames);
 }

 function createTags(containerId, pageMap, readOnly) {
     var getTagsSparql = templater(getTagsSparqlTemplate, pageMap);
     var getTagsUrl = sparqlQueryEndpoint + encodeURIComponent(getTagsSparql) + "&output=xml";

     var doneCallback = function (xml) {

         var tags = tagsXmlToJson(xml);

         var tagitMap = {
             readOnly: readOnly
         };

         $(containerId).tagit(tagitMap);

         for (var i = 0; i < tags.length; i++) {
             var uri = tags[i]["topicURI"];
             var label = tags[i]["topicLabel"];
             //  tagitMap[uri] = label;
             $(containerId).tagit('createTag', label);

             var selector = containerId + " input[value='" + label + "']";
             $(selector).attr("name", uri);
         }
     }
     getDataForURL(doneCallback, getTagsUrl);
 }

 function setupTagsPanel(tagsContainerId) {
     var doneCallback = function (xml) {
         var tags = tagsXmlToJson(xml);

         var tagitMap = {
             readOnly: true
         };

         $(tagsContainerId).tagit(tagitMap);

         for (var i = 0; i < tags.length; i++) {
             var uri = tags[i]["topicURI"];
             var label = tags[i]["topicLabel"];
             $(tagsContainerId).tagit('createTag', label);
         }
     }
     getAllTags(doneCallback);
 }

 function getAllTags(doneCallback) {
     var map = {
         "graphURI": graphURI
     };
     var getAllTagsSparql = templater(getAllTagsSparqlTemplate, map);

     var getAllTagsUrl = sparqlQueryEndpoint + encodeURIComponent(getAllTagsSparql) + "&output=xml";
     getDataForURL(doneCallback, getAllTagsUrl);
 }