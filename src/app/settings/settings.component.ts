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
  private data  = {stili : []}; //dati delle opzioni (stili)
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

      this.data.stili = this.graph.options.stili;
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
                "border-color": {"type": "string", "format": "color", "title": "border-color", "default": "#000000" },
                "border-width": { "type": "number", "title": "border-width" },
                "label": { "type": "string", "title": "label" },
                "text-halign": { "type": "string", "title": "text-halign", "enum": ["left", "right", "center"] },
                "text-valign": { "type": "string", "title": "text-valign", "enum": ["top", "bottom", "center"] },
                "width": { "type": "string", "title": "width" },
                "height": { "type": "string", "title": "height" }
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
          "minItems": 1,
          "items": { "$ref": "#/definitions/selector_obj" }
        }
      }
    };

    this.form = null;
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
