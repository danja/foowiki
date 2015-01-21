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
     if(readOnly) {
   createTags(containerId, pageMap, readOnly) ;
     } else {
         setupTagsAutocomplete(containerId, function(){
           createTags(containerId, pageMap, readOnly) ;
         });
     }
 }

function setupSearch(tagsContainerId) {
}

 function setupTagsAutocomplete(tagsContainerId, callback) {
     var doneCallback = function (xml) {
         var xmlString = (new XMLSerializer()).serializeToString(xml); // refactor me - see below
         //   console.log("XML = " + xmlString);
         var tagsXmlNames = ["topicURI", "topicLabel"];
         var tags = sparqlXMLtoJSON(xml, tagsXmlNames);



         //   availableTags: ["c++", "java", "php", "javascript", "ruby", "python", "c"]
         var allTags = [];

         for (var i = 0; i < tags.length; i++) {
             //    var uri = tags[i]["topicURI"];
             var label = tags[i]["topicLabel"];
             //  $(tagsContainerId).tagit('createTag', label);
             allTags.push(label);
         }
 //  $(tagsContainerId).tagit();
         var tagitMap = {
             
             readOnly: false,
              autocomplete: {
                 delay: 0,
                 minLength: 1
             },
             availableTags: allTags
         };


         console.log("tagitMap = " + JSON.stringify(tagitMap));
         $(tagsContainerId).tagit(tagitMap);
         callback();
     }
     getAllTags(doneCallback);
 }

function createTags(containerId, pageMap, readOnly) {
      var getTagsSparql = templater(getTagsSparqlTemplate, pageMap);

     //  console.log("getTagsSparql = " + getTagsSparql);
     var getTagsUrl = sparqlQueryEndpoint + encodeURIComponent(getTagsSparql) + "&output=xml";

     var doneCallback = function (xml) {
         var xmlString = (new XMLSerializer()).serializeToString(xml);
         //   console.log("XML = " + xmlString);
         var tagsXmlNames = ["topicURI", "topicLabel"];
         var tags = sparqlXMLtoJSON(xml, tagsXmlNames);

         //   console.log("TAGS = " + JSON.stringify(tags));

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
         var xmlString = (new XMLSerializer()).serializeToString(xml);
         //   console.log("XML = " + xmlString);
         var tagsXmlNames = ["topicURI", "topicLabel"];
         var tags = sparqlXMLtoJSON(xml, tagsXmlNames);

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

     //  console.log("getTagsSparql = " + getTagsSparql);
     var getAllTagsUrl = sparqlQueryEndpoint + encodeURIComponent(getAllTagsSparql) + "&output=xml";
     getDataForURL(doneCallback, getAllTagsUrl);
 }