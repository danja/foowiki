   /*
    *    System constants (URLs/URIs/IRIs)
    */

   /**
    * Comment template.
    * @param {string} foo This is a param with a description too long to fit in
    *     one line.
    * @return {number} This returns something that has a description too long to
    *     fit in one line.
    */

// recursive
// find ./ -type f -readable -writable -exec sed -i "s/FooWiki.preformatFormats/FooWiki.FooWiki.preformatFormats/g" {} \;

//    in core.js :
//  var getPageUrl = FooWiki.sparqlQueryEndpoint + encodeURIComponent(getPageSparql) + "&output=xml";
//  serverHostURI: "http://localhost:3030"

   var FooWiki = {
       pagesBaseURI: "http://hyperdata.it/wiki/",
       graphURI: "http://hyperdata.it/wiki",

       serverRootPath: "/foowiki/",
       sparqlQueryEndpoint: "http://fuseki.local:3030/foowiki/sparql?query=", // move ? part ??
       sparqlUpdateEndpoint: "http://fuseki.local:3030/foowiki/update",

       runnableFormats: [
       "http://purl.org/NET/mediatypes/application/javascript"
   ],

       preformatFormats: [
       "http://purl.org/NET/mediatypes/application/javascript",
           "http://purl.org/NET/mediatypes/text/html"
   ]

   }
