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


        function translateLocalLinks() {
            $('div.content  a').each(
                function () {
                    if (this.href.indexOf(serverRootPath) != -1) { // less than perfect
                        var hashPosition = this.href.indexOf("#");
                        if (hashPosition != -1) {
                            var anchor = this.href.substring(hashPosition); // "#Something"
                            anchor = anchor.trim().toLowerCase();
                            anchor = anchor.replace(/\s+/g, "-");
                            this.href = this.href.substring(0, hashPosition) + anchor;

                            $(this).click(function () {
                                $('html, body').animate({
                                    scrollTop: $(anchor).offset().top
                                }, 250);
                            });
                        } else {
                            // http://localhost:3030/foowiki/page.html?uri=http://hyperdata.it/wiki/Home%20Page
                            this.href = reviseHref(this);
                        }
                    }

                });
        }

        function reviseHref(aElement) {
            var oldHref = aElement.href;
            var linkText = aElement.text;

            if (location.href == oldHref) { // link href was blank
                var before = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + serverRootPath + "page.html?uri=" + pagesBaseURI;
                return oldHref.substring(0, before.length) + linkText;
            } else {
                var localRef = oldHref.substring(oldHref.indexOf(serverRootPath) + serverRootPath.length);
                return serverRootPath + "page.html?uri=" + pagesBaseURI + localRef;
            }
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

        function unescapeLiterals(text) {
            return text.replace(/&#34&#34&#34/g, '"""');
        }

        function escapeLiterals(text) {
            text.replace(/"""/g, "&#34&#34&#34");
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