**2023-07-23**

ChatGPT gave me :

function templater(raw, replacementMap) {

    const keys = Object.keys(replacementMap);
    const values = Object.values(replacementMap);

    return new Function(...keys, "return `" + raw + "`")(...values);
}

new Function(...Object.keys(replacementMap), "return `" + raw + "`")(...Object.values(replacementMap));