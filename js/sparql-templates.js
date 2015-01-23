/* Templates for SPARQL queries
 *
 * format is variant of Mustache
 * using ~{ }~ instead of {{ }}
 * (to avoid clashes in SPARQL)
 *
 * templating engine is Hogan
 * http://twitter.github.io/hogan.js/
 */

var commonPrefixes = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n\
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  \n\
PREFIX dc: <http://purl.org/dc/terms/>  \n\
PREFIX foaf: <http://xmlns.com/foaf/0.1/>  \n\
PREFIX sioc: <http://rdfs.org/sioc/ns#>  \n\
PREFIX wiki: <http://purl.org/stuff/wiki#>  \n\
";

var getPageListSparqlTemplate = commonPrefixes + " \n\
SELECT DISTINCT * \n\
FROM NAMED <~{graphURI}~>  \n\
WHERE { \n\
?uri \n\
dc:format ?format ; \n\
dc:date ?date ; \n\
dc:title ?title ; \n\
a wiki:Page ; \n\
foaf:maker [ \n\
foaf:nick ?nick \n\
] . \n\
} \n\
ORDER By DESC(?date)  \n\
# LIMIT 10 \n\
";

var getPageSparqlTemplate = commonPrefixes + "\n\
    SELECT DISTINCT * \n\
    FROM NAMED <~{graphURI}~>  \n\
    WHERE { \n\
    <~{pageURI}~> \n\
    dc:format ?format ; \n\
    dc:date ?date ; \n\
    dc:title ?title ; \n\
    sioc:content ?content ; \n\
    a wiki:Page ; \n\
    foaf:maker [ \n\
    foaf:nick ?nick \n\
    ] . \n\
} \n\
";

// ?tag dc:topic ?topicURI .  \n\

var getAllTagsSparqlTemplate = commonPrefixes + "\n\
SELECT DISTINCT *  \n\
 FROM NAMED <~{graphURI}~>  \n\
WHERE {  \n\
    ?topicURI rdfs:label ?topicLabel .  \n\
}  \n\
";

var getTagsSparqlTemplate = commonPrefixes + "\n\
SELECT DISTINCT *  \n\
 FROM NAMED <~{graphURI}~>  \n\
WHERE {  \n\
	<~{pageURI}~>  a wiki:Page ;  \n\
	dc:topic ?topicURI .  \n\
    ?topicURI rdfs:label ?topicLabel .  \n\
}  \n\
";


var postPageSparqlTemplate = commonPrefixes + "\n\
WITH <~{graphURI}~> \n\
DELETE { <~{pageURI}~>  ?p ?o }  \n\
WHERE { <~{pageURI}~>  ?p ?o } \n\
; \n\
INSERT DATA {  \n\
GRAPH <~{graphURI}~> {  \n\
\n\
<~{pageURI}~> \n\
dc:format <~{format}~> ; \n\
dc:date \"~{date}~\" ; \n\
dc:title \"\"\"~{title}~\"\"\" ; \n\
sioc:content  \"\"\"~{content}~\"\"\" ; \n\
a sioc:Post ; \n\
a wiki:Page ; \n\
foaf:maker [ \n\
foaf:nick \"~{nick}~\" \n\
] . \n\
}  \n\
}";


var postTagsSparqlTemplate = commonPrefixes + "\n\
INSERT DATA {  \n\
GRAPH <~{graphURI}~> {  \n\
\n\
~{#tags}~ \n\
    <~{pageURI}~> dc:topic <~{topicURI}~> . \n\
     <~{topicURI}~>  rdfs:label \"~{topicLabel}~\" . \n\
  ~{/tags}~ \n\
 \n\
} \n\
}";

var searchSparqlTemplate = commonPrefixes + "\n\
SELECT DISTINCT *  \n\
 FROM NAMED <~{graphURI}~>  \n\
 WHERE { \n\
?uri \n\
a sioc:Post ; \n\
a wiki:Page ; \n\
dc:format ?format ; \n\
dc:date ?date ; \n\
dc:title ?title ; \n\
sioc:content  ?content ; \n\
foaf:maker [ \n\
foaf:nick ?nick \n\
] . \n\
\n\
~{#tags}~ \n\
    <~{pageURI}~> dc:topic <~{topicURI}~> . \n\
     <~{topicURI}~>  rdfs:label \"~{topicLabel}~\" . \n\
  ~{/tags}~ \n\
         FILTER regex(?content, \"~{regex}~\", \"i\")  \n\
}";
 
// could probably be tidier
var deletePageSparqlTemplate = commonPrefixes + "\n\
WITH <~{graphURI}~> \n\
DELETE {  \n\
?o sioc:topic ?topic . \n\
}  \n\
WHERE {  \n\
<~{pageURI}~>  ?p ?o  . \n\
?o sioc:topic ?topic . \n\
} \n\
 ; \n\
WITH <~{graphURI}~> \n\
DELETE {  \n\
?maker foaf:nick ?nick . \n\
}  \n\
WHERE {  \n\
<~{pageURI}~> foaf:maker ?maker . \n\
?maker foaf:nick ?nick . \n\
} \n\
 ; \n\
WITH <~{graphURI}~> \n\
DELETE {  \n\
<~{pageURI}~>  ?p ?o .   \n\
}  \n\
WHERE { <~{pageURI}~>  ?p ?o } \n";