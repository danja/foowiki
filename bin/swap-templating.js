const fs = require('fs');

function replaceTemplateSubstrings(input) {

    // Use a regular expression to find ~{name}~
    const regex = /~\{([^{}]+)\}~/g;

    // Replace ~{name}~ with ${name}
    // this from ChatGPT overdoes the escaping - This is a \${variable\} and another \${other_variable\}.
    // const replacedString = input.replace(regex, (_, name) => `\\${'${'}${name}\\${'}'}`);

    // Replace ~{name}~ with ${name}
    const replacedString = input.replace(regex, (_, name) => `\${${name}}`);


    return replacedString;
}

function processFile(inputFilePath, outputFilePath) {
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading the input file: ${err}`);
            return;
        }

        const result = replaceTemplateSubstrings(data);

        fs.writeFile(outputFilePath, result, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing to the output file: ${err}`);
            } else {
                console.log(`File successfully processed and saved to ${outputFilePath}`);
            }
        });
    });
}

if (process.argv.length !== 4) {
    console.error('Usage: node swap-templating.js <inputFile> <outputFile>');
} else {
    const inputFile = process.argv[2];
    const outputFile = process.argv[3];
    processFile(inputFile, outputFile);
}
