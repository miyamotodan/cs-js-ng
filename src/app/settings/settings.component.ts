import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {


  @ViewChild('myform') myform: ElementRef;

  private data;
  private schema;
  private form;
  private option;

  constructor() { }

  ngOnInit() {

    this.option = {
      addSubmit: false, // Add a submit button if layout does not have one
      debug: false, // Don't show inline debugging information
      loadExternalAssets: true, // Load external css and JavaScript for frameworks
      returnEmptyFields: false, // Don't return values for empty input fields
      setSchemaDefaults: true, // Always use schema defaults for empty fields
      defaultWidgetOptions: { feedback: true }, // Show inline feedback icons
    };

    this.schema = {
      "definitions": {
        "selector_obj": {
          "type": "object",
          "title": "Stile",
          "properties": {
            "selector": { "type": "string", title: "selector" },
            "style": {
              "type": "object",
              "title": "Proprietà",
              "properties": {
                "shape": { type: "string", title: "value" },
                "background-color": { type: "string", title: "background-color" },
                "border-color": { type: "string", title: "border-color" },
                "border-width": { type: "number", title: "border-width" },
                "label": { type: "string", title: "label" },
                "text-halign": { type: "string", title: "text-halign", "enum": ["left", "right", "center"] },
                "text-valign": { type: "string", title: "text-valign", "enum": ["top", "bottom", "center"] },
                "width": { type: "string", title: "width" },
                "height": { type: "string", title: "height" }
              }
            }
          }
        }
      },
      "type": "object",
      "title": "Stili",
      "properties": {
        "stili": {
          "type": "array",
          "maxItems": 5,
          "items": { "$ref": "#/definitions/selector_obj" }
        }
      }
    };

    this.data = {
      "stili": [{
        selector: "node",
        style: {
          "shape": "ellipse",
          "background-color": "#f7cac9",
          "border-color": "#f7786b",
          "border-width": "2",
          "label": "-----",
          "text-halign": "center",
          "text-valign": "center",
          "width": "data(weight)",
          "height": "data(weight)"
        }
      }]
    };

    this.form = null;

  }

  submit(d) {
    console.log(d);
  }

  save() {
    //simula il submit invocando il metodo con i dati del form
    this.submit(this.myform.data);
  }

  load() {
    alert("settings.load()");
  }

}



