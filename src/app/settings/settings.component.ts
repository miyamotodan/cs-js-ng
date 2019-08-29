import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GraphRestApiService } from '../shared/graph-rest-api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {


  @ViewChild('myform') myform: any;

  private graph; //tutto il grafo
  private data = { styles: [], layout: "" }; //dati delle opzioni (stili, laYOUT)
  private schema; //schema del form
  private form; //layout del form
  private option; //opzioni del form
  private formdata; //dati live

  loaded: Promise<boolean>;

  constructor(public restApi: GraphRestApiService) {
    //all'inizio carica i dati
    this.load();
  }

  //caricamento dei dati da json
  //TODO:deve caricare diversi grafi non solo quello all'inizio della lista data[0]
  load() {
    //funzione che attende il caricamento dei dati facendo una subscribe al metodo che ritorna un promise
    this.restApi.getGraphs().subscribe((data: {}) => {
      //per ora prendo il primo grafo
      this.graph = data[0];

      console.log("GRAPH LOADED");
      console.log(this.graph);

      this.data = this.graph.options;
      this.loaded = Promise.resolve(true);
    });
  }

  ngOnInit() {

    this.option = {
      addSubmit: false, // Add a submit button if layout does not have one
      debug: false, // Don't show inline debugging information
      loadExternalAssets: true, // Load external css and JavaScript for frameworks
      returnEmptyFields: false, // Don't return values for empty input fields
      setSchemaDefaults: true, // Always use schema defaults for empty fields
      defaultWidgetOptions: { feedback: true }, // Show inline feedback icons
    };

    //questo form va bene per i nodi ma non per gli archi...
    //TODO:capire se si può fare variabile a seconda dei valori (tipo selector che contiene node o edge)
    this.schema = {
      "definitions": {
        "selector_obj": {
          "type": "object",
          "title": "Stile",
          "properties": {
            "selector": { "type": "string", "title": "selector" },
            "style": {
              "type": "object",
              "title": "Proprietà",
              "properties": {
                "shape": { "type": "string", "title": "shape" },
                "background-color": { "type": "string", "format": "color", "title": "background-color", "default": "#000000" },
                "border-color": { "type": "string", "format": "color", "title": "border-color", "default": "#000000" },
                "border-width": { "type": "number", "title": "border-width" },
                "label": { "type": "string", "title": "label" },
                "text-halign": { "type": "string", "title": "text-halign", "enum": ["left", "right", "center"] },
                "text-valign": { "type": "string", "title": "text-valign", "enum": ["top", "bottom", "center"] },
                "width": { "type": "string", "title": "width" },
                "height": { "type": "string", "title": "height" },

                "line-color": { "type": "string", "format": "color", "title": "line-color", "default": "#000000" },
                "curve-style": { "type": "string", "title": "curve-style", "enum": ["straight", "bezier", "segments","unbundled-bezier","haystack","taxi"] },
                "target-arrow-shape": { "type": "string", "title": "target-arrow-shape", "enum": ["triangle", "triangle-tee", "triangle-cross", "triangle-backcurve", "vee", "tee", "square", "circle", "diamond", "chevron", "none"] },
                "target-arrow-color": { "type": "string", "format": "color", "title": "target-arrow-color", "default": "#000000" },
              }
            }
          }
        }
      },
      "type": "object",
      "title": "Stili",
      "properties": {
        "layout": { "type": "string", "title": "layout" },
        "styles": {
          "type": "array",
          "minItems": 1,
          "items": { "$ref": "#/definitions/selector_obj" }
        }
      }
    };

    this.form = [
      {
        "key": "layout", "flex": "1 1 1200px",
        "notitle": false, "placeholder": "random,cola,..."
      },
      {
        "key": "styles",
        "type": "array",
        "items": [
          {
          "type": "div",
          "displayFlex": true,
          "flex-flow": "row wrap",
          "items": [
            {
              "key": "styles[].selector", "flex": "1 1 1200px",
              "notitle": false, "placeholder": "selector"
            },
            {
              "key": "styles[].style.shape", "flex": "1 1 300px",
              "notitle": false, "placeholder": "oval,rectangle,star,...",
              condition: { functionBody: 'try {return model.styles[arrayIndices[0]].selector.includes("node")} catch(e) { console.log(e); return false }' }
            },
            {
              "key": "styles[].style.background-color", "flex": "1 1 300px",
              "notitle": false, "placeholder": "color",
              condition: { functionBody: 'try {return model.styles[arrayIndices[0]].selector.includes("node")} catch(e) { console.log(e); return false }' }
            },
            {
              "key": "styles[].style.border-color", "flex": "1 1 300px", 
              "notitle": false, "placeholder": "color",
              condition: { functionBody: 'try {return model.styles[arrayIndices[0]].selector.includes("node")} catch(e) { console.log(e); return false }' }
            },
            {
              "key": "styles[].style.border-width", "flex": "1 1 300px",
              "notitle": false, "placeholder": "width",
              condition: { functionBody: 'try {return model.styles[arrayIndices[0]].selector.includes("node")} catch(e) { console.log(e); return false }' }
            },
            {
              "key": "styles[].style.label", "flex": "1 1 300px",
              "notitle": false, "placeholder": "label",
              condition: { functionBody: 'try {return model.styles[arrayIndices[0]].selector.includes("node")} catch(e) { console.log(e); return false }' }
            },
            {
              "key": "styles[].style.text-halign", "flex": "1 1 300px",
              "notitle": false, "placeholder": "left,right,center",
              condition: { functionBody: 'try {return model.styles[arrayIndices[0]].selector.includes("node")} catch(e) { console.log(e); return false }' }
            },
            {
              "key": "styles[].style.text-valign", "flex": "1 1 300px",
              "notitle": false, "placeholder": "top,bottom,center",
              condition: { functionBody: 'try {return model.styles[arrayIndices[0]].selector.includes("node")} catch(e) { console.log(e); return false }' }
            },
            {
              "key": "styles[].style.width", "flex": "1 1 300px",
              "notitle": false, "placeholder": "width",
              condition: { functionBody: 'try {return model.styles[arrayIndices[0]].selector.includes("node")} catch(e) { console.log(e); return false }' }
            },
            {
              "key": "styles[].style.height", "flex": "1 1 300px",
              "notitle": false, "placeholder": "height",
              condition: { functionBody: 'try {return model.styles[arrayIndices[0]].selector.includes("node")} catch(e) { console.log(e); return false }' }
            },


            {
              "key": "styles[].style.width", "flex": "1 1 300px",
              "notitle": false, "placeholder": "width",
              condition: { functionBody: 'try {return model.styles[arrayIndices[0]].selector.includes("edge")} catch(e) { console.log(e); return false }' }
            },
            {
              "key": "styles[].style.line-color", "flex": "1 1 300px",
              "notitle": false, "placeholder": "color",
              condition: { functionBody: 'try {return model.styles[arrayIndices[0]].selector.includes("edge")} catch(e) { console.log(e); return false }' }
            },
            {
              "key": "styles[].style.target-arrow-color", "flex": "1 1 300px",
              "notitle": false, "placeholder": "color",
              condition: { functionBody: 'try {return model.styles[arrayIndices[0]].selector.includes("edge")} catch(e) { console.log(e); return false }' }
            },
            {
              "key": "styles[].style.curve-style", "flex": "1 1 300px",
              "notitle": false, "placeholder": "style",
              condition: { functionBody: 'try {return model.styles[arrayIndices[0]].selector.includes("edge")} catch(e) { console.log(e); return false }' }
            },
            {
              "key": "styles[].style.target-arrow-shape", "flex": "1 1 300px",
              "notitle": false, "placeholder": "shape",
              condition: { functionBody: 'try {return model.styles[arrayIndices[0]].selector.includes("edge")} catch(e) { console.log(e); return false }' }
            },
            {
              "key": "styles[].style.label", "flex": "1 1 300px",
              "notitle": false, "placeholder": "label",
              condition: { functionBody: 'try {return model.styles[arrayIndices[0]].selector.includes("edge")} catch(e) { console.log(e); return false }' }
            }
          ]
        }
        ]
      }
    ];

  }

  submit(d) {

    //salvataggio dei dati sul json
    //TODO:deve salvare grafi diversi non solo quello con id=1
    this.graph.options = d;

    console.log(this.graph);

    //funzione che attende il salvataggio dei dati facendo una subscribe al metodo che ritorna un promise
    this.restApi.updateGraph(this.graph.id, this.graph).subscribe((data: {}) => {
      console.log(d);
    });

  }

  save() {
    //simula il submit invocando il metodo con i dati live del form
    this.submit(this.formdata);
  }

  change(d) {
    //ultimo stato del form
    this.formdata = d;
  }


}
