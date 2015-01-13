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

        /* ultra-simple templating engine
         * replacementMap contains { "name": value, ... }
         * every instance of ${name} in template gets replaced with value
         *
         * (it could be maybe done with map() and/or some kind of reflection, but I reckon this is clearer
         */
        function templater(template, replacementMap) {
            for (var name in replacementMap) {
                var reg = new RegExp("\\$\\{" + name + "\\}", "g");
                template = template.replace(reg, replacementMap[name]);
            }
            return template;
        }

        function escapeRegExp(string) {
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }

        function replaceAll(string, find, replace) {
            return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
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
                    console.log("this = " + this);
                    if (this.href.indexOf(serverBaseURI) != -1) { // less than perfect
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
                            var localRef = this.href.substring(serverBaseURI.length);
                               console.log("new = " + this.href.substring(serverBaseURI.length));
                            //  console.log("new href = " + this.href);
                            this.href = serverBaseURI + "page.html?uri=" + pagesBaseURI + localRef;
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

        function escape(markup) {
            markup = markup.replace(/&/g, "&amp;");
            markup = markup.replace(/</g, "&lt;");
            markup = markup.replace(/>/g, "&gt;");
            return markup;
        }