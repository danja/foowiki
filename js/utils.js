        function escapeRegExp(string) {
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }
        
        function replaceAll(string, find, replace) {
            return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
        }
        
        var queryString = (function(a) {
            if (a == "") return {};
                           var b = {};
                           for (var i = 0; i < a.length; ++i)  {
                               var p=a[i].split('=', 2);
                               if (p.length == 1)
                                   b[p[0]] = "";
                               else
                                   b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                           }
                           return b;
        })(window.location.search.substr(1).split('&'));
        
        
        function translateLocalLinks() {
            $('div.content  a').each(
                function(){
                    if (this.href.indexOf(serverBaseURI) == 0) {
                   console.log("old href = "+this.href);
                        var localRef = this.href.substring(serverBaseURI.length);
                       console.log("new = "+this.href.substring(serverBaseURI.length));
                      console.log("new href = "+this.href);
                        this.href = serverBaseURI + "page.html?uri="+pagesBaseURI+localRef;
                    }
                    
                });
       //     console.log("edit link = "+$('#editLink').href);
        }


function escape(markup){
	markup = markup.replace(/&/g, "&amp;");
	markup = markup.replace(/</g, "&lt;");
	markup = markup.replace(/>/g, "&gt;");
	return markup;
}

        function xmlToEntry(pageURI, xml) {
            var xmlString = (new XMLSerializer()).serializeToString(xml);

            // workaround for wrong interpretation of charset
            xmlString = xmlString.replace(/[^\u0000-\u007F]/g, '');
            // maybe force to ISO-8859-1, also known as Latin-1 instead?

            var $xml = $(xmlString);
            var entry = "";
            
             var results = $xml.find("result");
            
            if (results.length == 0) { 
                return false;
            }

            results.each(function () {
                var uri, date, title, content, nick;

                //			$(this).find("binding[name='uri']").each(function() {
                //				uri = $(this).text().trim();
                //			});
                uri = "page.html?uri=" + pageURI;

                $(this).find("binding[name='date']").each(function () {
                    date = $(this).text().trim();
                });
                $(this).find("binding[name='title']").each(function () {
                    title = $(this).text().trim();
                });
                $(this).find("binding[name='content']").each(function () {
                    content = $(this).text().trim();
                });
                $(this).find("binding[name='nick']").each(function () {
                    nick = $(this).text().trim();
                });

                entry += generateEntry(uri, date, title, content, nick);
            });
            return entry;
        }

 function xmlToRows(xml) {
var xmlString = (new XMLSerializer()).serializeToString(xml);

                // workaround for wrong interpretation of charset
                xmlString = xmlString.replace(/[^\u0000-\u007F]/g, '');
                // maybe force to ISO-8859-1, also known as Latin-1 instead?

                var $xml = $(xmlString);
                var rows = "";

                $xml.find("result").each(function () {
                    var uri, date, title, nick; // content,

                    $(this).find("binding[name='uri']").each(function () {
                        uri = $(this).text().trim();
                    });
                    $(this).find("binding[name='date']").each(function () {
                        date = $(this).text().trim();
                    });
                    $(this).find("binding[name='title']").each(function () {
                        title = $(this).text().trim();
                    });
                    //	$(this).find("binding[name='content']").each(function() {
                    //		content = $(this).text().trim();
                    //	});
                    $(this).find("binding[name='nick']").each(function () {
                        nick = $(this).text().trim();
                    });

                    rows += generatePageRow(uri, date, title, nick); // content, 
                });
     return rows;
 }