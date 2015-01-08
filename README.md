NB. In the process of moving this from the Seki repository I broke something... gimmee an hour or two...

# FuWiki
A minimal [SPARQL](http://www.w3.org/TR/sparql11-overview/) [Wiki](http://en.wikipedia.org/wiki/Wiki)

As it stands it's suitable for use as a personal wiki. It uses [Markdown](http://en.wikipedia.org/wiki/Markdown) editing syntax. It doesn't contain features like page locking or authentication (feel free to add these!).

All FuWiki needs is a (static file) HTTP server and a SPARQL 1.1 server. It's being developed against [Fuseki](http://jena.apache.org/documentation/serving_data/), the Jena SPARQL server (which has a built-in HTTP server) and the instructions below follow this setup. (Please let me know if you get it running against a different SPARQL server, I'll include notes here).

## Installation
First clone the FuWiki files somewhere convenient. These will be served as regular HTML.

Next download Fuseki according to the [instructions](http://jena.apache.org/documentation/serving_data/). Then adjust the configuration according to your setup and run it. There are three files to consider for this:

1. the Fuseki config file - the one provided as FuWiki/etc/seki-config.ttl includes a suitable store definition (called seki)
2. a script to run Fuseki pointing at its config file - the one provided as FuWiki/etc/run-fuseki.bat should help as a starting point
3. the FuWiki config file, FuWiki/js/config.js - the one provided is the one I use against the two files above

Assuming you have a setup close to this, opening http://localhost:3030 should take you to the Fuseki pages. Click on Control Panel. When offered, select the /seki dataset. You should now see Fuseki's raw SPARQL interface. 

It's easiest to bootstrap the Wiki with a few pages, so go to File upload at the bottom of the SPARQL interface and enter the wiki graph name '''http://hyperdata.it/wiki''' and upload FuWiki/examples/pages.ttl

You may wish to customise the graph name, it's specified in FuWiki/js/config.js. If so, either do a search/replace in pages.ttl or skip the file upload and go straight to a (non-existent) page by pointing your browser at a URL of the form '''http://localhost:3030/fuwiki/page.html?uri=http://hyperdata.it/wiki/Hello%20World'''.

## Using FuWiki
Opening http://localhost:3030/fuwiki/index.html in a browser will display a list of pages in the Wiki. From there it should be self-explanatory, if not, let me know.

## How it works
Most of the code appears as jQuery-flavoured Javascript inside the HTML files (index.html, page.html and edit.html). Could do with refactoring :)

Queries are composed using (ever-so-simple) templating on FuWiki/js/sparql-templates.js. The XML results are (crudely) parsed out using jQuery. Interaction with the SPARQL server is done using jQuery Ajax. Markdown parsing is done by the marked.js lib.

There's some sample data etc. in the FuWiki/examples directory.

Apache 2 license.

## See Also
I plan to use the same data model in [Seki](https://github.com/danja/seki) (middleware/a front-end for connecting to an independent SPARQL server using node.js) and [Thiki](https://github.com/danja/thiki) (Personal Wiki for Android Devices).