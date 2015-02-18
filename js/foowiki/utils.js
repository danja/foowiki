        function spinner() {
            var $loading = $('#spinner').hide();
            $.ajaxSetup({
                beforeSend: function () {
                    $('#spinner').show();
                },
                complete: function () {
                    $('#spinner').hide();
                },
                success: function () {}
            });
        }

         // bit of a sledgehammer, but whatever works...
        Array.prototype.contains = function (obj) {
            var i = this.length;
            while (i--) {
                if (this[i] == obj) {
                    return true;
                }
            }
            return false;
        }

        function setupErrorHandling() {
            $("#errorbox").hide();
            $("#errorbox").click(function () {
                // $("#errorbox").toggle(500);
                $("#errorbox").hide();
            });

            $.ajaxSetup({
                error: function (x, status, error) {
                    $("#errorbox").text(status + ": " + error);
                    $("#errorbox").toggle(500);
                    // $("#errorbox").toggle(2000);
                }
            });
        }

        function sparqlTemplater(raw, replacementMap, isWrite) {
            if (isWrite && replacementMap["content"]) {
                replacementMap["content"] = escapeLiterals(replacementMap["content"]);

            }
            return templater(raw, replacementMap);
        }

        function unescapeLiterals(text) {
            var data = text.replace(/&#34&#34&#34/g, '"""');
            return data;
        }

        function escapeLiterals(text) {
            return text.replace(/"""/g, "&#34&#34&#34");
        }


        /*  */
        function templater(raw, replacementMap) {
            var template = Hogan.compile(raw, {
                delimiters: '~{ }~'
            });

            var result = template.render(replacementMap);
            return htmlUnescape(result);
        }

        /* parse URL */
        var queryString = (function (a) {
            if (a == "") return {};
            var b = {};
            for (var i = 0; i < a.length; ++i) {
                var p = a[i].split('=', 2);
                if (p.length == 1)
                    b[p[0]] = "";
                else
                    b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
            }
            return b;
        })(window.location.search.substr(1).split('&'));

        function getCurrentPageURI() {
            return encodeURI(queryString["uri"]);
        }

        function translateLinks(object) {
            $('div.content  a', object).each(
                function () {
                    var href = this.href;
                    console.log("HREF=" + href);
                    if (href.indexOf(serverRootPath) != -1) { // less than perfect, in-page links maybe involve pagesBaseURI
                        var hashPosition = href.indexOf("#");
                        if (hashPosition != -1) {
                            var anchor = href.substring(hashPosition); // "#Something"
                            anchor = anchor.trim().toLowerCase();
                            anchor = anchor.replace(/\s+/g, "-");
                            this.href = href.substring(0, hashPosition) + anchor;

                            $(this).click(function () {
                                $('html, body').animate({
                                    scrollTop: $(anchor).offset().top
                                }, 250); // milliseconds
                            });
                        } else {
                            // http://localhost:3030/foowiki/page.html?uri=http://hyperdata.it/wiki/Home%20Page
                            this.href = reviseHref(this);
                        }
                        return;
                    }
                });

            $("img", object).each(function () {
                //  var split = window.location.href.split("/");
                //    var path = split.slice(0, split.length - 1).join("/");
                //     path = path + "/" + $(this).attr("src") + "&type=image";
                // $(this).attr("src", path);


                var path = pagesBaseURI + $(this).attr("src");
                var me = this;
                var setImgSrc = function (src) {
                    console.log("SRC=" + src);
                    $(me).attr("src", src);
                }
                getImage(path, setImgSrc);
            });

            // somethin similar for handlin img 404s
            // 1unnamed.jpg =>
            //  http://localhost:3030/foowiki/page.html?uri=http://hyperdata.it/wiki/1unnamed.jpg&type=image
            /*
              $('div.content  img', object).each(
                function () {
                    var src = $(this).attr("src");
                //    console.log("this.src="+$(this).attr("src"));
                    var newSrc = serverRootPath+"page.html?uri="+pagesBaseURI+src+"&type=image";
                  $(this).attr("src",newSrc);
                });
                */
        }

        function reviseHref(aElement) {
            var oldHref = aElement.href;

            //   if (!aElement.text && (location.href == aElement.href)) { // both blank, insert index link   
            //        aElement.text = "Home Page";
            //   }

            var linkText = aElement.text;
            //    console.log("OFFSITEx"+linkText);
            if (linkText) {
                //   console.log("OFFSITEx"+linkText);
                if (aElement.href.indexOf(serverRootPath) == -1) { // off site, less than perfect BROKEN
                    //      console.log("OFFSITE");
                    $(aElement).append(aElement.href); // use link as label
                    return;
                }
                if (location.href == oldHref) { // link href was blank
                    var before = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + serverRootPath + "page.html?uri=" + pagesBaseURI;
                    return oldHref.substring(0, before.length) + linkText;
                } else {
                    var localRef = oldHref.substring(oldHref.indexOf(serverRootPath) + serverRootPath.length);
                    return serverRootPath + "page.html?uri=" + pagesBaseURI + localRef;
                }
            }
            includeContent(aElement);
            return;


        }

        function includeContent(aElement) {

            var oldHref = aElement.href;
            var localRef = oldHref.substring(oldHref.indexOf(serverRootPath) + serverRootPath.length);
            //   var pageURI = serverRootPath + "page.html?uri=" + pagesBaseURI + localRef;
            var pageURI = pagesBaseURI + localRef;


            //  $(aElement).append("filler");
            console.log("REF=" + aElement.href);

            var handler = function (pageMap, entryJSON) { // entryHandler(pageMap, entryJSON);
                //        console.log("pageMap=" + JSON.stringify(pageMap));
                //        console.log("CONTEN=" + JSON.stringify(entryJSON));
                if (entryJSON && entryJSON[0] && entryJSON[0]["content"]) {
                    var content = formatContent(entryJSON[0]["content"]);
                } else {
                    content = "<em>**undefined link**</em>";
                }

                $(aElement).replaceWith(content);
            }

            console.log("pageURI=" + pageURI);
            getPage(pageURI, handler);

        }

         // little workaround for odd marked.js behaviour, at least in part due to marked.js line 793 regex
         // if the header is a link, the id ends up as "-like-this-like-this-" 
        function fixHeaderIDs() {
            $(".content h1, .content h2, .content h3, .content h4, .content h5, .content h6").each(function () {
                var id = $(this).attr("id");
                if (id) {
                    var length = id.length;
                    if (id[0] == "-" && id[length - 1] == "-") {
                        //      console.log("need to fix");
                        id = id.substring(1, length / 2);
                        $(this).attr("id", id);
                    }
                    //    console.log("ID = " + id);
                }
            });
        }

        function escapeXml(markup) {
            markup = markup.replace(/&/g, "&amp;");
            markup = markup.replace(/</g, "&lt;");
            markup = markup.replace(/>/g, "&gt;");
            //  markup = escapeLiterals(markup);
            return markup;
        }

        function escapeRegExp(string) {
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }

        function replaceAll(string, find, replace) {
            return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
        }

        function tweakBlockquotes(content) {
            var blockquoteSplit = content.split("```");
            if (blockquoteSplit.length > 1) {
                for (var i = 1; i < blockquoteSplit.length; i = i + 2) {
                    //    console.log("X=" + blockquoteSplit[i]);
                    blockquoteSplit[i] = hUnescape(blockquoteSplit[i]);
                }
            }
            return blockquoteSplit.join("```");
        }

        function htmlUnescape(value) {

            value = value.replace(/&lt;/g, "<");
            value = value.replace(/&gt;/g, ">");
            value = value.replace(/&quot;/g, "\"");
            value = value.replace(/&amp;/g, "&");

            return value;
        }

        function hUnescape(value) {

            var d = $("<div>");
            d.html(value);
            return d.text();
        }