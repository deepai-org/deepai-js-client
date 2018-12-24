# DeepAI JS Client
[![npm version](https://img.shields.io/npm/v/deepai.svg?style=flat-square)](https://www.npmjs.org/package/deepai)

Simple Javascript Client Library for [Deep AI's](https://deepai.org) APIs from Browser and Node.js

## Installation:

Node.js or other environments using npm:
```bash
npm install --save deepai
```

Browser:
* Option 1: (Recommended) Load the library from DeepAI's CDN:
    ```
    <script src="https://cdnjs.deepai.org/deepai.min.js"></script>
    ```
* Option 2: Download and copy "dist/deepai.min.js" into your HTML
* Option 3: include this npm package, use [webpack](https://webpack.js.org/) or [browserify](http://browserify.org/), and "require('deepai'')"

## Usage Examples:
Most examples are for [Content Moderation](https://deepai.org/machine-learning-model/content-moderation), but you can subsitute any model name available at DeepAI.

Ensure that you pass the correct input names. Not all model input names are "image".

All examples use [Async-Await](https://javascript.info/async-await) syntax, so ensure you run the code in an async function.

####Browser:
```js
// Ensure you load deepai with one of the methods in "Installation"
deepai.setApiKey('YOUR_API_KEY'); // get your free API key at https://deepai.org
```


Pass URL:
```js
var result = await deepai.callStandardApi("content-moderation", {
    image: "https://YOUR_IMAGE_URL"
});
```

Pass Literal Text:
```js
var result = await deepai.callStandardApi("sentiment-analysis", {
    text: "I am very happy to play with the newest APIs!"
});
```


Pass Image DOM Element:
```js
var result = await deepai.callStandardApi("content-moderation", {
    image: document.getElementById('yourImageId')
});
```
Pass [File Picker](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file) Element:
```js
var result = await deepai.callStandardApi("content-moderation", {
    image: document.getElementById('yourFilePickerId')
});
```
####Node.js

```js
const deepai = require('deepai');
deepai.setApiKey('YOUR_API_KEY'); // get your free API key at https://deepai.org
```


Pass URL:
```js
var result = await deepai.callStandardApi("content-moderation", {
    image: "https://YOUR_IMAGE_URL"
});
```

Pass Literal Text:
```js
var result = await deepai.callStandardApi("sentiment-analysis", {
    text: "I am very happy to play with the newest APIs!"
});
```

Pass File Upload:
```js
const fs = require('fs');

<...>

var result = await deepai.callStandardApi("content-moderation", {
    image: fs.createReadStream('/path/to/your/file.jpg')
});
```


## Build this library (not required for users of this libary): 

```bash
npm install
npm run-script build
```
