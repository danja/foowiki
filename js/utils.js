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
                    console.log("this.href = " + this.href);
                    if (this.href.indexOf(serverRootPath) != -1) { // less than perfect
                        var hashPosition = this.href.indexOf("#");
                        if (hashPosition != -1) {
                            var anchor = this.href.substring(hashPosition); // "#Something"

                            //        anchor = anchor.toLowerCase().replace(/^\s+|\s+$/g, "-");
                            anchor = anchor.trim().toLowerCase();
                            anchor = anchor.replace(/\s+/g, "-");

                            this.href = this.href.substring(0, hashPosition) + anchor;
                            //.replace(/\w+/g, '-')
                            //  console.log("anchor = " + anchor);

                            $(this).click(function () {
                                console.log("CLICKED anchor = " + anchor);
                                //    window.scrollTo(0, $(anchor).offset());
                                console.log("offset = " + $(anchor).offset());
                                $('html, body').animate({
                                    scrollTop: $(anchor).offset().top
                                }, 250);
                            });
                        } else {
                            if (location.href == this.href) { // link href was blank
                                var split = this.href.split("/");
                                var slice = split.slice(0, split.length - 1);
                                this.href = slice.join("/") + "/" + this.text; // need to encode?
                                //     console.log("rel = "+rel);
                            } else {
                                //      console.log("location.href = " + location.href);
                                //        console.log("old href = " + this.href);
                                //      console.log("this.text = " + this.text);
                                // http://localhost:3030/foowiki/page.html?uri=http://hyperdata.it/wiki/FuWiki%20To%20Do
                                var localRef = this.href.substring(this.href.indexOf(serverRootPath) + serverRootPath.length);
                                //   console.log("new = " + this.href.substring(serverRootPath.length));
                                //      console.log("new href = " + this.href);
                                this.href = serverRootPath + "page.html?uri=" + pagesBaseURI + localRef;
                            }
                        }
                    }

                });
            //     console.log("edit link = "+$('#editLink').href);
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
            return blockquoteSplit.join("````");
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

        function setupImageUploading() {
            $('#fileSelector').change(function (event) {
                var file = event.target.files[0];
                var reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = function (event) {
                    var base64 = reader.result;

                    var file = $('#fileSelector')[0].files[0]
//if(file){
 // console.log(file.name);
// }
                    var imageName =  file.name;
                    
                    //$('#base64').attr('value', base64);
                    var blob = dataURLToBlob(base64);
                    var formData = new FormData();
                    formData.append('file', blob);

                    $.ajax({
                        url: '/echo/json/',
                        type: 'POST',
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        dataType: 'text',
                        success: function (response) {
                            $('#result').text(response);
                        }
                    });
                    $('#original_image').attr('src', base64);
                    $('#original_image').attr('name', imageName);
                }
            });
        }