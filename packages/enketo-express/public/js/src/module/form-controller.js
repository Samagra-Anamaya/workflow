import { xml2json } from './xml2json';

import settings from './settings';
import imageCompression from 'browser-image-compression';
const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 840,
    useWebWorker: true,
}



// import { config } from '../../../../app/models/config-model';

// const config = require( '../../../../app/models/config-model' ).server;
// console.log(config)

// const config = {
//     'formManagerBaseURI': 'http://localhost:3002/'
// };

export class FormController {

    /* formSpec = {
      "submissionURL": "http://esamwad.samagra.io/api/v4/form/submit",
      "name": "SampleForm",
      "messageOnSubmit": "Form submitted successfully",
      "messageOnFailure": "Form submission failed",
      "isSuccess": "async (formData) => { console.log(formData); }",
      "onFormSuccess": "async (formData) => { console.log(formData); }",
      "onFormFailure": "async (formData) => { console.log(formData); }",
      "nextFormOnSuccess": "formID2",
      "nextFormOnFailure": "formID3"
    }
    */

    /* formSpec = {
        "skipOnSuccessMessage": true,
        "prefill": {},
        "submissionURL": "http://esamwad.samagra.io/api/v4/form/submit",
        "name": "SampleForm",
        "successCheck": "async (formData) => { console.log('From isSuccess', formData.getElementsByTagName('reg_no')[0].textContent); return formData.getElementsByTagName('reg_no')[0].textContent === 'registration123'; }",
        "onSuccess": {
          "notificationMessage": "Form submitted successfully or not Maybe",
          "sideEffect": "async (formData) => { return JSON.parse(decodeURIComponent('%7B%0A%20%20%20%20%20%20%20%20%22name%22%3A%20%22DEVA%22%2C%0A%20%20%20%20%20%20%20%20%22batch%22%3A%20%222021-2023%22%2C%0A%20%20%20%20%20%20%20%20%22id%22%3A%208%2C%0A%20%20%20%20%20%20%20%20%22DOB%22%3A%20%222005-03-04%22%2C%0A%20%20%20%20%20%20%20%20%22affiliationType%22%3A%20%22NCVT%22%2C%0A%20%20%20%20%20%20%20%20%22registrationNumber%22%3A%20%22ICA211021569832%22%2C%0A%20%20%20%20%20%20%20%20%22tradeName%22%3A%20%22Electrician%22%2C%0A%20%20%20%20%20%20%20%20%22iti%22%3A%207%2C%0A%20%20%20%20%20%20%20%20%22industry%22%3A%201%2C%0A%20%20%20%20%20%20%20%20%22itiByIti%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22id%22%3A%207%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22name%22%3A%20%22GITI%20Nagina%22%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%22industryByIndustry%22%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22id%22%3A%201%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22name%22%3A%20%22Kaushal%20Bhawan%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22latitude%22%3A%2030.695753%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22longitude%22%3A%2076.872025%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22schedules%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22is_industry%22%3A%20true%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D')); }",
          "next": {
            "type": "form",
            "id": "form2"
          }
        },
        "onFailure": {
          "message": "Form submission failed",
          "sideEffect": "async (formData) => { console.log(formData); }",
          "next": {
            "type": "url",
            "id": "google"
          }
        }
      }
      */

    constructor() {
        /* Valid States:
            INITIALIZED
            FORM_SUCCESS
            FORM_FAILURE
            ON_SUBMIT_SUCCESS
            ON_SUBMIT_FAILURE
            ON_FORM_SUCCESS_COMPLETED
            ON_FORM_FAILURE_COMPLETED
        */
        this._state = 'INITIALIZED';
        this._message = '';
        // this.formSpec = formSpec;
        this._parser = new DOMParser();
        this.formFiles = null;

        // this.formSpec.isSuccessExecute = () => this.executeMethod(this.formSpec.successCheck);
        // this.formSpec.onFormSuccessExecute = () => this.executeMethod(this.formSpec.onSuccess.sideEffect);
        // this.formSpec.onFormFailureExecute = () => this.executeMethod(this.formSpec.onFailure.sideEffect);
    }

    async executeMethod(functionString) {
        // execute method string
        if (functionString) {
            //TODO: fix this with a sandbox
            return (0, eval)(functionString)(this.formData);
        } else {
            throw new Error('No function string provided');
        }
    }

    get state() {
        return this._state;
    }

    findKey(obj, val, keyToFind, currentDotNotation) {
        if (typeof obj === 'object') {
            for (const key in obj) {
                if (obj[key] === val && key === keyToFind) {
                    return currentDotNotation;
                } else {
                    const result = this.findKey(obj[key], val, keyToFind, currentDotNotation + '.' + key);
                    if (result !== null) return result;
                }
            }
        }
        return null;
    }

    async uploadFile(data) {
        console.log("Ab dekh data:", data)
        if (data) {
            const fd = new FormData();
            var newFile = new File([data], data.name, { type: data.type });
            // Compressing this file
            newFile = await imageCompression(newFile, options)
            fd.append('file', newFile, data.name);
            const response = await fetch(`${settings.formManagerBaseURI}/form/uploadFile`, {
                method: 'POST',
                body: fd
            }).then(s => {
                return s.json();
            }).catch(e => {
                console.log(e);
                return null;
            });

            return response ? response.fileURL : null;
        }
        return null;
    }

    set(obj, path, value) {
        if (Object(obj) !== obj) return obj; // When obj is not an object
        // If not yet an array, get the keys from the string-path
        if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || [];
        path.slice(0, -1).reduce((a, c, i) => // Iterate all of them except the last one
            Object(a[c]) === a[c] // Does the key exist and is its value an object?
                // Yes: then follow that path
                ? a[c]
                // No: create the key. Is the next key a potential array-index?
                : a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1]
                    ? [] // Yes: assign a new array object
                    : {}, // No: assign a new plain object
            obj)[path[path.length - 1]] = value; // Finally assign the value to the last key

        return obj; // Return the top-level object to allow chaining
    }


    // async processForm(formData, formFiles) {
    //     const doc = this._parser.parseFromString(formData, 'text/xml');

    //     // Uploading images to Minio and replacing in formData
    //     for (let i = 0; i < formFiles.length; i++) {
    //         let minioUri = await this.uploadFile(formFiles[i]);
    //         console.log(minioUri, formFiles[i].name);
    //         if (minioUri) {
    //             formData = formData.replace(formFiles[i].name, minioUri);
    //         }
    //     }

    //     console.log("Updated FormData:", formData);

    //     const parseRes = await fetch(`${settings.formManagerBaseURI}/parse`, {
    //         method: "POST",
    //         body: JSON.stringify({ xml: formData.toString() }),
    //         headers: {
    //             "Content-type": "application/json; charset=UTF-8"
    //         }
    //     }).then(res => res.json()).catch(e => {
    //         this._state = 'FORM_FAILURE_OFFLINE';
    //         this.formFiles = formFiles;
    //         window.parent.postMessage(JSON.stringify({
    //             state: this._state,
    //             formDataXml: formData,
    //             formFilesXml: formFiles
    //         }), '*');
    //     });

    //     if (parseRes == undefined)
    //         return Promise.resolve({
    //             status: "offline",
    //             message: "You are oflline. Your form data has been saved. Please re-submit using the submit button once back online"
    //         });
    //     this.formData = parseRes.data;

    //     // for (let i = 0; i < formFiles.length; i++) {
    //     //     const file = formFiles[i];
    //     //     const fileURL = await this.uploadFile(file);
    //     //     // console.log({ fileURL });
    //     //     console.log(this.findKey)
    //     //     const kk = this.findKey(this.formData, file.name, '$t', '');
    //     //     this.formData = this.set(this.formData, kk.substring(1), fileURL);
    //     // }
    //     if (await this.formSpec.isSuccessExecute() === true) {
    //         this._state = 'FORM_SUCCESS';
    //         this._onFormSuccessData = await this.formSpec.onFormSuccessExecute();
    //         this._state = 'ON_FORM_SUCCESS_COMPLETED';
    //         this.nextForm = this.formSpec.onSuccess.next;
    //         this._message = this.formSpec.messageOnSuccess;
    //     } else {
    //         this._state = 'FORM_FAILURE';
    //         this._onFormFailureData = this.formSpec.onFormFailureExecute();
    //         this._state = 'ON_FORM_FAILURE_COMPLETED';
    //         this.nextForm = this.formSpec.onFailure.next;
    //         this._message = this.formSpec.messageOnFailure;
    //     }

    //     return Promise.resolve({
    //         state: this._state,
    //         status: this._state.includes('FAILURE') ? 'failure' : 'success',
    //         message: this._message,
    //         nextForm: this.nextForm,
    //         onFormSuccessData: this._onFormSuccessData,
    //         onFormFailureData: this._onFormFailureData
    //     });
    // }

    async processFormNew(formData, formFiles) {
        const doc = this._parser.parseFromString(formData, 'text/xml');

        // Uploading images to Minio and replacing in formData
        for (let i = 0; i < formFiles.length; i++) {
            let minioUri = await this.uploadFile(formFiles[i]);
            console.log(minioUri, formFiles[i].name);
            if (minioUri) {
                formData = formData.replace(formFiles[i].name, minioUri);
            }
        }

        console.log("Updated FormData:", formData);

        const parseRes = await fetch(`${settings.formManagerBaseURI}/parse`, {
            method: "POST",
            body: JSON.stringify({ xml: formData.toString() }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(res => res.json()).catch(e => {
            this._state = 'FORM_FAILURE_OFFLINE';
            this.formFiles = formFiles;
            window.parent.postMessage(JSON.stringify({
                state: this._state,
                formDataXml: formData,
                formFilesXml: formFiles
            }), '*');
        });

        if (parseRes == undefined) {
            // this._state = 'FORM_FAILURE';
            // this._onFormFailureData = this.formSpec.onFormFailureExecute();
            this._state = 'ON_FORM_FAILURE_COMPLETED';
            // this.nextForm = this.formSpec.onFailure.next;
            // this._message = this.formSpec.messageOnFailure;
        } else {
            this.formData = parseRes.data;
            // this._state = 'FORM_SUCCESS';
            // this._onFormSuccessData = await this.formSpec.onFormSuccessExecute();
            this._state = 'ON_FORM_SUCCESS_COMPLETED';
            // this.nextForm = this.formSpec.onSuccess.next;
            // this._message = this.formSpec.messageOnSuccess;
        }

        return Promise.resolve({
            state: this._state,
            status: this._state.includes('FAILURE') ? 'failure' : 'success',
            message: this._message,
            nextForm: this.nextForm,
            onFormSuccessData: this._onFormSuccessData,
            onFormFailureData: this._onFormFailureData
        });
    }

    async broadcastFormData() {
        // broadcast form data to parent window
        window.parent.postMessage(JSON.stringify({
            nextForm: this.nextForm,
            formData: this.formData,
            onSuccessData: this._onFormSuccessData,
            onFailureData: this._onFormFailureData,
            state: this._state
        }), '*');
    }

    async broadcastFormDataUpdate(xml, fileURLs) {
        console.log("Broadcasting file update")
        // broadcast form data to parent window
        window.parent.postMessage(JSON.stringify({
            formData: xml,
            formXML: xml,
            state: this._state,
            fileURLs: fileURLs
        }), '*');
    }

    async broadcastFileRemoveUpdate(xml, fileURLs) {
        console.log("Broadcasting file update")
        // broadcast form data to parent window
        window.parent.postMessage(JSON.stringify({
            formData: xml,
            formXML: xml,
            state: this._state,
            fileURLs: fileURLs
        }), '*');
    }


    async submit() {
        // submit form data to server
        const response = await fetch(this.formSpec.submissionURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.formData)
        });
        const data = await response.json();
        if (data.status === 'success') {
            this._state = 'ON_SUBMIT_SUCCESS';
        } else {
            this._state = 'ON_SUBMIT_FAILURE';
        }

        return data;
    }
}
