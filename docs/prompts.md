The HTML contains elements of the form :

<a href='http://link'>

the following is attached to these elements :

 aElement.addEventListener('click', function(event) {
    // event handling
    });

    in event handling, how do I get the value of the href attribute from the event?

    ---

    I am refactoring code which uses a Hogan javascript templater to instead use Template Literals. Currently the templating is done through a function which is provided a string eg. raw="one ~{key}~ two" and a map, eg. replacementMap={"key":"two"} to produce the result result "one two three". The function is result =templater(raw, replacementMap). What is this function using template literals?

    that is what I have already. I would like to see a function that uses string interpolation rather that regex, with raw="one ${two} three" 

    shouldn't the keys and values somehow appear in the template?

    function templater(raw, replacementMap) {
  // Create a template literal using the raw string and replacementMap
  const keys = Object.keys(replacementMap);
  const values = Object.values(replacementMap);
  
  const template = new Function(...keys, "return `" + raw + "`")(...values);

  return template;
}

const raw = "north ${key1} south ${key2}";
const replacementMap = { "key1": "east", "key2": "west" };

const result = templater(raw, replacementMap);
console.log(result); // Output: "one two two three"

-------------------

In javascript, how do I do a regex that takes substrings of the form "~{name}~" and replace them with "${name}" without impacting the rest of the text. The strings are to be used in template literals, so please consider escaping any characters which may cause a problem.  

, I get SyntaxError: Unexpected end of input.

