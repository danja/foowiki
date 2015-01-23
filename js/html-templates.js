/* Templates for HTML blocks
 *
 * format is variant of Mustache
 * using ~{ }~ instead of {{ }}
 * (to avoid clashes in SPARQL)
 *
 * templating engine is Hogan
 * http://twitter.github.io/hogan.js/
 */

var entryTableTemplate = " \n\
        <table id='pagesTable'> \n\
            <tr> \n\
                <th colspan='3'><a href='index.html'>FuWiki</a> Pages</th> \n\
            </tr> \n\
            <tr> \n\
                <th class='center'>Page</th> \n\
                <th class='center'>Date</th> \n\
                <th class='center'>Creator</th> \n\
            </tr> \n\
            <tr id='entries'></tr> \n\
        </table> \n\
            ";

var rowTemplate = " <tr> \
           <td><a href='~{uri}~'>~{title}~</a></td> \
           <td class='center'>~{date}~</td> \
            <td class='center'>~{nick}~</td> \
            </tr>";

var editEntryTemplate = "<div class='entry'> \
            <h1 class='center'><a href=\"~{uri}~\">~{title}~</a></h1> \
            <form> \
  <fieldset> \
        <legend>Edit Post</legend>\
            <label for='title'>Title</label> \
            <input id='title' type='text' value='~{title}~'></input> \
            <label for='content'>Content</label> \
            <textarea class='content' id='content' rows='20'>~{content}~</textarea> \
            <label for='maintagscontainer'>Tags</label> \
            <ul id='maintagscontainer'  id='allowSpacesTags'> \
            </ul> \
            <label for='nick'>Nick</label> \
            <input id='nick' type='text' value='~{nick}~'></input> \
            <label for='format'>Format</label><!-- is Media Type URI --> \
            <select id='format'> \
               <option value='http://purl.org/NET/mediatypes/text/markdown'>Markdown</option> \
               <option value='http://purl.org/NET/mediatypes/application/javascript'>Javascript</option> \
            </select> \
 </fieldset> \
            </form> \
            </div>";

var pageEntryTemplate = "<div class='entry'> \
            <h1 class='center' id='pagetitle'><a href=~{uri}~>~{title}~</a></h1> \
            <div class='content'>~{content}~</div> \
            <div class='byline center'>latest edit by ~{nick}~ on ~{date}~</div> \
      <label for='maintagscontainer'>Tags</label> \
            <ul id='maintagscontainer'> \
            </ul> \
            </div> \
            <div id='searchContainer'> \
                <h2>Search</h2> \
<label for='searchText'>Search Text</label> \
            <input id='searchText' type='text' value=''></input> \
               <div id='tagButtons'> </div>\
            </div>  ";

var entryTemplate = "<div class='entry'> \
            <h1 class='center'><a href=~{uri}~>~{title}~</a></h1> \
            <div class='content'>~{content}~</div> \
            <div class='byline center'>latest edit by ~{nick}~ on ~{date}~</div> \
            </div>";