'use strict';

const apiBaseUrl = require('./apiBaseUrl').baseUrl;

var WAD_COLORS = [
  "rgb(173, 35, 35)",   // Red
  "rgb(42, 75, 215)",   // Blue
  "rgb(87, 87, 87)",    // Dark Gray
  "rgb(29, 105, 20)",   // Green
  "rgb(129, 74, 25)",   // Brown
  "rgb(129, 38, 192)",  // Purple
  "rgb(160, 160, 160)", // Lt Gray
  "rgb(129, 197, 122)", // Lt green
  "rgb(157, 175, 255)", // Lt blue
  "rgb(41, 208, 208)",  // Cyan
  "rgb(255, 146, 51)",  // Orange
  "rgb(199, 183, 0)",  // Yellow
  "rgb(233, 222, 187)", // Tan
  "rgb(255, 205, 243)", // Pink
  // "rgb(255, 255, 255)", // White
  //"rgb(0, 0, 0)",       // Black
];

var isAbsolute = new RegExp('^([a-z]+://|//)', 'i');
var isDataOrBlob = new RegExp('^(data|blob):', 'i');

function prependApiBaseIfNeeded(url){

    if (isAbsolute.test(url) || isDataOrBlob.test(url)) {
        return url; // already absolute
    }else{
        return apiBaseUrl + url; // turn relative into absolute
    }
}


/*

result
{
    output_url:
    output:
    id:
}


resultPageData
{
    result_data: {
        inputs:[
            {
                is_img: true,
                url: (relative or absolute)
            }
        ],
        visualizer_data: {
            list_key: 'Objects'
            label_key: 'Object'
        },
        scale_applied: 1.333
    }
}

*/

async function renderResultIntoElement(result, element){
    element.innerHTML = ''; // remove everything to start
    if(result.err){
        element.innerHTML = err;
        return false;
    }

    if(result.output){
        // JSON or text output.
        console.log('got json or text output');

        console.log('getting result page data');
        var resultPageData = await fetch(apiBaseUrl + '/get_standard_api_result_data/'+result.id, {
          credentials: 'include'
        });
        resultPageData = await resultPageData.json();
        console.log('got result page data');

        if(typeof result.output === 'string'){
            var scroller = document.createElement("div");
            scroller.style.width = '100%';
            scroller.style.height = '100%';
            scroller.style.overflow = 'auto';
            scroller.style.display = 'flex';
            scroller.style.alignItems = 'center';
            scroller.style.flexDirection = 'column';
            element.appendChild(scroller);

            var pre = document.createElement("pre");
            pre.textContent = result.output;
            pre.style.whiteSpace = "pre-wrap";
            pre.style.margin = '0px';

            scroller.appendChild(pre);

            // Append inputs
            for(var input of resultPageData.result_data.inputs){
                if(input.is_img){
                    var img_tag = document.createElement('img');
                    img_tag.src = prependApiBaseIfNeeded(input.url);
                    img_tag.style.position = 'relative';
                    img_tag.style.width = '100%';
                    img_tag.style.height = '100%%';
                    img_tag.style.objectFit = 'contain';
                    scroller.appendChild(img_tag);
                }
            }

            return true;

        }else if(typeof result.output === 'object'){

            // If we uploaded an image, then we may be able to render the image with boxes on top



            if(    resultPageData.result_data.inputs.length == 1
                && resultPageData.result_data.inputs[0].is_img
                && resultPageData.result_data.visualizer_data
                ){
                // single image input and we know how to visualize it.
                console.log('have visualizer for result JSON');
                var resultscaler = document.createElement('iframe');


                // Set up a handler for when the frame loads - we need to handle this event
                resultscaler.onload = function() {
                    // Firefox doesnt allow inner iframe manip until the iframe is loaded...


                    var innerDoc = resultscaler.contentDocument.body;
                    innerDoc.style.margin = '0px';
                    innerDoc.style.overflow = 'hidden';
                    var bbox_container = document.createElement('boundingboxcontainer');
                    bbox_container.style.position = 'relative'; // the absolute positions are relative to this element
                    bbox_container.style.opacity = '0.001'; // the result are hidden until the iframe reflows - which is first when the img loads

                    innerDoc.appendChild(bbox_container);

                    var img_tag = document.createElement('img');
                    img_tag.src = prependApiBaseIfNeeded(resultPageData.result_data.inputs[0].url);
                    img_tag.style.position = 'absolute';
                    bbox_container.appendChild(img_tag);

                    var iframe_reflow = function(){
                        console.log('iframe resize');

                        resultscaler.contentDocument.body.style.transform = null;
                        var bodyWidth = resultscaler.contentDocument.body.scrollWidth;
                        var bodyHeight = resultscaler.contentDocument.body.scrollHeight;

                        var imgWidth = img_tag.offsetWidth;
                        var imgHeight = img_tag.offsetHeight;


                        var containerWidth = resultscaler.offsetWidth;
                        var containerHeight = resultscaler.offsetHeight;

                        var wExcess=0;
                        var hExcess=0;

                        if(imgWidth < bodyWidth && imgHeight < bodyHeight){
                            var wScale = containerWidth / imgWidth;
                            var hScale = containerHeight / imgHeight;
                            var minScale = Math.min(wScale, hScale);
                            wExcess = containerWidth - imgWidth*minScale;
                            hExcess = containerHeight - imgHeight*minScale;
                        }else{
                            var wScale = containerWidth / bodyWidth;
                            var hScale = containerHeight / bodyHeight;
                            var minScale = Math.min(wScale, hScale);
                            wExcess = containerWidth - bodyWidth*minScale;
                            hExcess = containerHeight - bodyHeight*minScale;
                        }

                        wExcess = wExcess/minScale;
                        hExcess = hExcess/minScale;


                        resultscaler.contentDocument.body.style.transformOrigin = 'top left';
                        resultscaler.contentDocument.body.style.transform = 'scale('+minScale+')';

                        bbox_container.style.setProperty('--fontscale', (100/minScale)+ "%");
                        bbox_container.style.left = (wExcess/2)+"px";
                        bbox_container.style.top = (hExcess/2)+"px";
                        bbox_container.style.opacity = '1';


                    };

                    resultscaler.contentWindow.onresize = iframe_reflow;

                    img_tag.onload = iframe_reflow;

                    var processed_annotations = process_annotations(result.output, resultPageData.result_data.visualizer_data, resultPageData.result_data.scale_applied);
                    console.log('processed annotations', processed_annotations);
                    var i = 0;
                    for(var annotation of processed_annotations){
                        var bbox = document.createElement('boundingbox');
                        bbox.style.position = 'absolute';

                        bbox.style.left = annotation.bounding_box[0]+'px';
                        bbox.style.top = annotation.bounding_box[1]+'px';
                        bbox.style.width = annotation.bounding_box[2]+'px';
                        bbox.style.height = annotation.bounding_box[3]+'px';
                        var color = WAD_COLORS[i++ % WAD_COLORS.length];
                        bbox.style.border = '2px solid '+color;
                        bbox_container.appendChild(bbox);

                        var bbox_label = document.createElement('boundingboxlabel');
                        bbox_label.textContent = annotation.caption;
                        bbox_label.style.color = 'white';
                        bbox_label.style.fontFamily = 'arial';
                        bbox_label.style.backgroundColor = color;
                        bbox_label.style.fontSize = 'var(--fontscale)';
                        bbox.appendChild(bbox_label);
                    }

                }

                // Set the src which will end up triggering the onload event in all browsers.
                resultscaler.src='about:blank';
                resultscaler.style.border = 'none';
                resultscaler.style.width = '100%';
                resultscaler.style.height = '100%';
                element.appendChild(resultscaler);
                return true;


            }else{
                // not single image - perhaps multi image or text input.
                // or no visualizer
                console.log('no visualizer for result JSON');
                var scroller = document.createElement("div");
                scroller.style.width = '100%';
                scroller.style.height = '100%';
                scroller.style.overflow = 'auto';
                scroller.style.display = 'flex';
                scroller.style.alignItems = 'center';
                scroller.style.flexDirection = 'column';

                element.appendChild(scroller);

                var pre = document.createElement("pre");
                pre.style.margin = '0px';
                pre.textContent = JSON.stringify(result.output, null, 4);
                scroller.appendChild(pre);

                // Append inputs
                for(var input of resultPageData.result_data.inputs){
                    if(input.is_img){
                        var img_tag = document.createElement('img');
                        img_tag.src = prependApiBaseIfNeeded(input.url);
                        img_tag.style.width = '100%';
                        img_tag.style.height = '79%';
                        img_tag.style.objectFit = 'contain';
                        scroller.appendChild(img_tag);
                    }
                }

                return true;


                // We got JSON output for a multi image or text input ... don't bother showing the input right now

            }

        }else{
            element.innerHTML = "Model returned an unknown data type.";
            return false;
        }

    }else if(result.output_url){
        // Image output.
        console.log('got image output');

        // Just show the image.
        var img_tag = document.createElement('img');
        img_tag.src = result.output_url;
        img_tag.style.position = 'relative';
        img_tag.style.width = '100%';
        img_tag.style.height = '100%';
        img_tag.style.objectFit = 'contain';
        element.appendChild(img_tag);
        return true;

    }else{
        element.innerHTML = "Model did not return an output or an error.";
        return false;
    }
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function toTitleCase(str) {
  return str.replace(
      /\w\S*/g,
      function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
  );
}

function process_annotations(input_struct, visualizer_data, scale_applied){
    input_struct = JSON.parse(JSON.stringify(input_struct)); // cheap deep clone
    var detections = input_struct[visualizer_data.list_key];
    detections.sort(function(a, b) {
        return b.confidence - a.confidence;
    });

    var count = Math.min(15, detections.length);

    var processed_annotations = [];
    for (var i = 0; i < count; i++) {
        var detection = detections[i];
        var caption;
        if(visualizer_data.label_key=='demographic'){
          if(detection[visualizer_data.label_key]){
            caption = detection[visualizer_data.label_key]; // backwards compatible demog format
          }else{
          //"White Male, 30-40"
            caption = detection['cultural_appearance']+' '+detection['gender']+', '+detection['age_range'][0]+'-'+detection['age_range'][1]
          }
        }else if(visualizer_data.label_key=='people'){
          //produces "Sad, White Male, 30-40, Ted Cruz"
          var parts = [];
          if(detection['facial-expression-recognition'] && detection['facial-expression-recognition']['emotion'] != null){
            parts.push(  capitalizeFirstLetter(detection['facial-expression-recognition']['emotion']) );
          }
          if(detection['demographic-recognition'] && detection['demographic-recognition']['cultural_appearance'] != null){
            parts.push( detection['demographic-recognition']['cultural_appearance']+' '+detection['demographic-recognition']['gender']+', '+detection['demographic-recognition']['age_range'][0]+'-'+detection['demographic-recognition']['age_range'][1]);
          }
          if(detection['celebrity-recognition'] && detection['celebrity-recognition']['name'] != null && detection['celebrity-recognition']['name'] != 'unknown'){
            parts.push(  toTitleCase(detection['celebrity-recognition']['name']) );
          }
          if(parts.length > 0){
            caption = parts.join(', ');
          }else{
            caption = "Face";
          }
        }else{
          caption = detection[visualizer_data.label_key]; // non demographic mode
        }

        detection.bounding_box[0] *= scale_applied;
        detection.bounding_box[1] *= scale_applied;
        detection.bounding_box[2] *= scale_applied;
        detection.bounding_box[3] *= scale_applied;

        processed_annotations.push({
            bounding_box: detection.bounding_box,
            caption: caption
        });
    }
    return processed_annotations;
}

module.exports = {
    renderResultIntoElement: renderResultIntoElement
};
