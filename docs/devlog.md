**2023-07-23**

ChatGPT gave me :

function templater(raw, replacementMap) {

    const keys = Object.keys(replacementMap);
    const values = Object.values(replacementMap);

    return new Function(...keys, "return `" + raw + "`")(...values);
}

new Function(...Object.keys(replacementMap), "return `" + raw + "`")(...Object.values(replacementMap));

**2023-07-24**

I got a bit further changing the code to use native template literals. But had forgotten that moustache/Hogan includes logic like conditionals and loops

{
  "beatles": [
    { "firstName": "John", "lastName": "Lennon" },
    { "firstName": "Paul", "lastName": "McCartney" },
    { "firstName": "George", "lastName": "Harrison" },
    { "firstName": "Ringo", "lastName": "Starr" }
  ],
  "name": function () {
    return this.firstName + " " + this.lastName;
  }
}

Template:

{{#beatles}}
* {{name}}
{{/beatles}}
Output:

* John Lennon
* Paul McCartney
* George Harrison
* Ringo Starr

There are 'tagged templates' that allow custom logic, 

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates

but it looks pretty involved. I think from the SPARQL I'd only need to handle one level of lists and exists/not-exists conditionals, but still a lot of work when Hogan/moustache already works. Leave as maybe-later.

https://github.com/janl/mustache.js




