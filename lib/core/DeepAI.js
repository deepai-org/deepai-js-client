"use strict";
const axios = require("axios");

const apiBaseUrl = require("./apiBaseUrl").baseUrl;

const resultRendering = require("./resultRendering.js");

let isBrowserEnv = typeof window !== 'undefined';

const globalObject = isBrowserEnv ? window : global;


let formData;

if (typeof window !== 'undefined' && window.FormData) {
    // We're in a browser environment
    formData = window.FormData;
} else {
    // We're in a node environment
    try {
        formData = require("form-data");
    } catch (error) {
        console.error("Error requiring form-data:", error);
        // Handle the error or set a default value for formData
    }
}


/**
 * Create a new instance of DeepAI
 *
 */

function DeepAI(customAxiosInstance) {
  if (customAxiosInstance) {
      this.axiosInstance = customAxiosInstance;
  } else {
      this.axiosInstance = axios.create({
          headers: { "client-library": "deepai-js-client" },
      });
  }
}


DeepAI.prototype.setApiKey = function (apiKey) {
  this.apiKey = apiKey;
  this.axiosInstance.defaults.headers.common["api-key"] = apiKey;
};

function urlForModel(model_name) {
  return apiBaseUrl + "/api/" + model_name;
}

DeepAI.prototype.callStandardApi = async function request(model_name, inputs_object) {
    const form = new formData();
    for (let key of Object.keys(inputs_object)) {
        const input = inputs_object[key];
        if (!input) continue;

        if (typeof input === "string") {
            form.append(key, input);
        } else if (isBrowserEnv && input instanceof globalObject.Element) {
            if (input.tagName === "IMG") {
                if (input.src) {
                    form.append(key, input.src);
                    // TODO: Handle data URLs and blob URLs
                } else {
                    throw new Error(`DeepAI error: Image element has no SRC: ${key}`);
                }
            } else if (input.tagName === "INPUT" && input.files) {
                if (input.files.length > 0) {
                    form.append(key, input.files[0], "file.jpeg");
                } else {
                    throw new Error(`DeepAI error: File picker has no file picked: ${key}`);
                }
            } else {
                throw new Error(`DeepAI error: DOM Element type for key: ${key}`);
            }
        } else if (input.hasOwnProperty("fd")) {
            form.append(key, input);
        } else if (globalObject.Buffer && globalObject.Buffer.isBuffer(input)) {
            form.append(key, input, "file.jpeg");
        } else {
            throw new Error(`DeepAI error: unknown input type for key: ${key}`);
        }
        // TODO: Ensure filenames are unique if necessary
    }



  var req_options = {
    withCredentials: true,
  };
  if (form.getHeaders !== undefined) {
    // formData is the nodejs based subsitute, only needed for node.js
    req_options.headers = form.getHeaders();
  }
  const response = await this.axiosInstance.post(
    urlForModel(model_name),
    form,
    req_options
  );
  return response.data;
};

DeepAI.prototype.renderResultIntoElement =
  resultRendering.renderResultIntoElement;
DeepAI.prototype.renderAnnotatedResultIntoElement =
  resultRendering.renderAnnotatedResultIntoElement;

module.exports = DeepAI;
