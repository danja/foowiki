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

 // see similar examples around http://stackoverflow.com/questions/18550151/posting-base64-data-javascript-jquery

 function setupImageUploading() {
     $('#fileSelector').change(function (event) {
             var file = event.target.files[0];
             var reader = new FileReader();
             reader.readAsDataURL(file);

             reader.onload = function (event) {
                 var dataURL = reader.result;
                 //    console.log("base64 = " + base64);
                 var file = $('#fileSelector')[0].files[0]
                     //if(file){
                     // console.log(file.name);
                     // }
                 var imageLabel = file.name;

                 var BASE64_MARKER = ';base64,';
                 //    if (dataURL.indexOf(BASE64_MARKER) == -1) {
                 var parts = dataURL.split(',');
                 var contentType = parts[0].split(':')[1];
                 var raw = parts[1];
                 //     } ;

                 // ADD MEDIA TYPE
                 var map = {
                     "graphURI": graphURI,
                     "imageURI": pagesBaseURI+imageLabel,
                     "imageLabel": imageLabel,
                     "imageData": raw
                 };
                 var data = templater(postImageSparqlTemplate, map);
                 $.ajax({
                     type: "POST",
                     url: sparqlUpdateEndpoint,
                     data: ({
                         update: data
                     })
                 }).done(function () {});
                 $('#original_image').attr('src', dataURL);
                 $('#original_image').attr('name', imageLabel);
             }
         
     });
 }

 // image uploading
 function dataURLToBlob(dataURL) {
     var BASE64_MARKER = ';base64,';
     if (dataURL.indexOf(BASE64_MARKER) == -1) {
         var parts = dataURL.split(',');
         var contentType = parts[0].split(':')[1];
         var raw = parts[1];

         return new Blob([raw], {
             type: contentType
         });
     } else {
         var parts = dataURL.split(BASE64_MARKER);
         var contentType = parts[0].split(':')[1];
         var raw = window.atob(parts[1]);
         var rawLength = raw.length;

         var uInt8Array = new Uint8Array(rawLength);

         for (var i = 0; i < rawLength; ++i) {
             uInt8Array[i] = raw.charCodeAt(i);
         }

         return new Blob([uInt8Array], {
             type: contentType
         });
     }
 }

 // SEARCH --------------------------

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
         $("#results").empty();
         $("#results").append(results);
         console.log("HERE" + results);
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
         var link = templater(resultTemplate, entry);
         /* console.log("LINK "+link); */
         links += link;
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

 // TAGS Stuff
 function setupTags(containerId, pageMap, readOnly) {
     if (readOnly) {
         createTags(containerId, pageMap, readOnly);
     } else {
         setupTagsAutocomplete(containerId, function () {
             createTags(containerId, pageMap, readOnly);
         });
     }
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