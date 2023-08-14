# DeepAI JS Client

[![npm version](https://img.shields.io/npm/v/deepai.svg?style=flat-square)](https://www.npmjs.org/package/deepai)
[![CodeQL](https://github.com/deepai-org/deepai-js-client/actions/workflows/codeql.yml/badge.svg)](https://github.com/deepai-org/deepai-js-client/actions/workflows/codeql.yml)

The official Javascript Client Library for accessing [Deep AI's](https://deepai.org) advanced machine learning models. Designed for both browser and Node.js environments.

## Installation:

### Node.js or other environments using npm:

```bash
npm install --save deepai
```

### Browser:

- Option 1 (Recommended): Load the library from DeepAI's CDN:

```html
<script src="https://cdnjs.deepai.org/deepai.min.js"></script>
```
- Option 2: Download and copy "dist/deepai.min.js" into your project and include in HTML.
- Option 3: Include this npm package, bundle with tools like webpack or browserify, and use require('deepai').

## Usage Examples:
Most examples are for NSFW Detector (nsfw-detector), but you can substitute any model name from the DeepAI model list.

Ensure that you pass the correct input names. They vary based on the model. Refer to each model's documentation on DeepAI.org for specifics.

All examples use Async-Await syntax, so ensure you run the code in an async function.

### Browser:
Initialize and set your API key:
```js
deepai.setApiKey("YOUR_API_KEY"); // Obtain your API key from https://deepai.org
```

Pass URL:
Using the Super Resolution model:
```js
var result = await deepai.callStandardApi("torch-srgan", {
  image: "https://YOUR_IMAGE_URL",
});
```

Pass Literal Text:
For the Text Generation model:
```js
var result = await deepai.callStandardApi("text-generator", {
  text: "Your long article or text goes here.",
});
```

Pass Image DOM Element:
Using the NSFW Detector model:
```js
var result = await deepai.callStandardApi("nsfw-detector", {
  image: document.getElementById("yourImageId"),
});
```


Pass File Picker Element:
Using the Waifu 2x model:
```js
var result = await deepai.callStandardApi("waifu2x", {
  image: document.getElementById("yourFilePickerId"),
});
```

### Node.js:
Initialize and set your API key:
```js
const deepai = require("deepai");
deepai.setApiKey("YOUR_API_KEY"); // Obtain your API key from https://deepai.org
```

Pass URL:
Using the NSFW Detector model:

```js
var result = await deepai.callStandardApi("nsfw-detector", {
  image: "https://YOUR_IMAGE_URL",
});
```

Pass Literal Text:
For the Text Generation model:
```js
var result = await deepai.callStandardApi("text-generator", {
  text: "Your long article or text goes here.",
});
```

Pass File Upload:
Using the NSFW Detector model:
```js
const fs = require('fs');

// ...

var result = await deepai.callStandardApi("nsfw-detector", {
    image: fs.createReadStream('/path/to/your/file.jpg')
});
```
### Text to Image Options:
For all "Text to Image" models, the following options are available:

#### `text`:
(Required) A string, URL, or binary text file that serves as the main prompt for the image generation.

#### `negative_prompt`:
(Optional) A string to indicate elements you'd like to be removed from or avoided in the image.

Can be used to enhance image quality and details.

Example negative prompts:

bad anatomy, bad proportions, blurry, cloned face, cropped, deformed, dehydrated, disfigured, duplicate, error, extra arms, extra fingers, extra legs, extra limbs, fused fingers, gross proportions, jpeg artifacts, long neck, low quality, lowres, malformed limbs, missing arms, missing legs, morbid, mutated hands, mutation, mutilated, out of frame, poorly drawn face, poorly drawn hands, signature, text, too many fingers, ugly, username, watermark, worst quality.

#### `grid_size`:
(Optional) Pass a string, either "1" or "2".

“2” is the default, which returns a 2x2 grid with 4 images. Pass “1” to only receive 1 image.

#### `width`, `height`:
(Optional) Pass a string, e.g., "256" or "768". Default is "512".
Acceptable values range between 128 and 1536. Note: values above approximately 700 or below 256 may produce strange outputs.

Example:
```json
{
	"text": "A serene beach at sunset",
	"negative_prompt": "No people",
	"grid_size": "4x4",
	"width": "1024",
	"height": "768"
}
```
Adjust these options to customize the output according to your requirements.

## Available Models:
### Text to Text:
- Text Generator (`text-generator`)
### Image to Text:
- NSFW Detector (`nsfw-detector`)
- Image Similarity (`image-similarity`)
### Text to Image:
- Text to Image (`text2img`)
- Stable Diffusion (`stable-diffusion`)
- Cute Creature Generator (`cute-creature-generator`)
- Fantasy World Generator (`fantasy-world-generator`)
- Cyberpunk Generator (`cyberpunk-generator`)
- Anime Portrait Generator (`anime-portrait-generator`)
- Old Style Generator (`old-style-generator`)
- Renaissance Painting Generator (`renaissance-painting-generator`)
- Abstract Painting Generator (`abstract-painting-generator`)
- Impressionism Painting Generator (`impressionism-painting-generator`)
- Surreal Graphics Generator (`surreal-graphics-generator`)
- 3D Objects Generator (`3d-objects-generator`)
- Origami 3D Generator (`origami-3d-generator`)
- Hologram 3D Generator (`hologram-3d-generator`)
- 3D Character Generator (`3d-character-generator`)
- Watercolor Painting Generator (`watercolor-painting-generator`)
- Pop Art Generator (`pop-art-generator`)
- Contemporary Architecture Generator (`contemporary-architecture-generator`)
- Future Architecture Generator (`future-architecture-generator`)
- Watercolor Architecture Generator (`watercolor-architecture-generator`)
- Fantasy Character Generator (`fantasy-character-generator`)
- Steampunk Generator (`steampunk-generator`)
- Logo Generator (`logo-generator`)
- Pixel Art Generator (`pixel-art-generator`)
- Street Art Generator (`street-art-generator`)
- Surreal Portrait Generator (`surreal-portrait-generator`)
- Anime World Generator (`anime-world-generator`)
- Fantasy Portrait Generator (`fantasy-portrait-generator`)
- Comics Portrait Generator (`comics-portrait-generator`)
- Cyberpunk Portrait Generator (`cyberpunk-portrait-generator`)
### Image to Image:
- Super Resolution (`torch-srgan`)
- Waifu2x (`waifu2x`)
- Colorizer (`colorizer`)

## Development:
### Build & Publish:
For contributors and maintainers of the library:
```js
npm install
npm run-script build
npm login
npm publish
```

## More Information:
The browser-based build uses the webpack-generated code in dist/. The Node.js environment utilizes the code in the lib folder, which can also function in the browser, for instance, in a React webpack application.

For more detailed documentation, model explanations, and FAQs, visit DeepAI.org.

## License:
[MIT License](https://github.com/deepai-org/deepai-js-client/blob/master/LICENSE)
