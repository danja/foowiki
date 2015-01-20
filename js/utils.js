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

           var template = Hogan.compile(raw, {delimiters: '~{ }~'});
            
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
                    console.log("this.href = " + this.href);
                    if (this.href.indexOf(serverRootPath) != -1) { // less than perfect
                        var hashPosition = this.href.indexOf("#");
                        if (hashPosition != -1) {
                            var anchor = this.href.substring(hashPosition); // "#Something"

                            anchor = anchor.toLowerCase().replace(/^\s+|\s+$/g, "");
                            //.replace(/\w+/g, '-')
                            console.log("anchor = " + anchor);

                            $(this).click(function () {
                                console.log("CLICKED anchor = " + anchor);
                                //    window.scrollTo(0, $(anchor).offset());
                                console.log("offset = " + $(anchor).offset());
                                $('html, body').animate({
                                    scrollTop: $(anchor).offset().top
                                }, 250);
                            });
                        } else {
                            console.log("old href = " + this.href);
                            // http://localhost:3030/foowiki/page.html?uri=http://hyperdata.it/wiki/FuWiki%20To%20Do
                            var localRef = this.href.substring(this.href.indexOf(serverRootPath) + serverRootPath.length);
                            console.log("new = " + this.href.substring(serverRootPath.length));
                            //  console.log("new href = " + this.href);
                            this.href = serverRootPath + "page.html?uri=" + pagesBaseURI + localRef;
                        }
                    }

                });
            //     console.log("edit link = "+$('#editLink').href);
        }

         // little workaround for odd marked.js behaviour, at least in part due to marked.js line 793 regex
         // if the header is a link, the id ends up as "-like-this-like-this-" 
        function fixHeaderIDs() {
            $("h2").each(function () {
                var id = $(this).attr("id");
                var length = id.length;
                if (id[0] == "-" && id[length - 1] == "-") {
                    //      console.log("need to fix");
                    id = id.substring(1, length / 2);
                    $(this).attr("id", id);
                }
                //    console.log("ID = " + id);

            });
        }

        function escapeXml(markup) {
            markup = markup.replace(/&/g, "&amp;");
            markup = markup.replace(/</g, "&lt;");
            markup = markup.replace(/>/g, "&gt;");
            return markup;
        }

        function escapeRegExp(string) {
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }

        function replaceAll(string, find, replace) {
            return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
        }

function htmlUnescape(value){ 
  value = value.replace(/&lt;/g, "<");
    value = value.replace(/&gt;/g, ">");
   
    value = value.replace(/&quot;/g, "\"");
     value = value.replace(/&amp;/g, "&");
    return value;
}