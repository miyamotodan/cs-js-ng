import { Component, OnInit } from '@angular/core';
import { GraphRestApiService } from '../shared/graph-rest-api.service';

import * as cs from 'cytoscape';
import * as cscola from 'cytoscape-cola';
import * as csctxm from 'cytoscape-cxtmenu';

cs.use(cscola);
cs.use(csctxm);

@Component({
  selector: 'app-cscomp',
  templateUrl: './cscomp.component.html',
  styleUrls: ['./cscomp.component.scss']
})
export class CscompComponent implements OnInit {

  //cytoscape
  private cy: cs.Core;

  //gestione della creazione di un arco
  private drawMode = false;
  private sourceNode = null;

  //posizione del mouse
  private position = null;

  //archi e nodi del grafo
  private graph = null;

  constructor(public restApi: GraphRestApiService) {

    //funzione che attende il caricamento dei dati facendo una subscribe al metodo che ritorna un promise
    this.restApi.getGraphs().subscribe((data: {}) => {

      //per ora prendo il primo grafo
      this.graph = data[0].graph;
      //aggiungo gli elementi al grafo corrente
      this.cy.add(this.graph);
      //dispongo il grafo in modo random
      this.cy.layout({name: 'random'}).run();

    });

  }


  //ridimensiona il canvas del grafo
  //TODO:bisogna provarla chiamandola dal componente padre
  resetCySize = () => {

    this.cy.resize();
    this.cy.fit();

  }

  ngOnInit() {

    //ritorna la label per l'icona del menu contestuale
    let iconLabel = (label) => {
      return '<span style="font-family: helvetica neue, helvetica, liberation sans, arial, sans-serif;font-size: 12px;display: block;text-align: left;">'+label+'</span>';
    }

    //funzione chiamata quando viene selezionato il menù contestuale del nodo per inserire un arco
    let selectLink = (ele) => {

        if (this.drawMode) {
            //chiudo l'arco
            var edgeId = this.sourceNode.id()+'-'+ele.id();
            var eles = ele.cy().add([
                                { group: 'edges', data: { id: edgeId, source:this.sourceNode.id(), target: ele.id() } }
                            ]);
            resetDraw();
        } else {

            //apro l'arco
            this.drawMode=true;
            this.sourceNode=ele;
            ele.select();

        }

        console.log("---");
        console.log( "selectLink (" + ele.id() +")" );
        console.log( "drawMode (" + this.drawMode +")" );
        if (this.sourceNode) console.log( "sourceNode (" + this.sourceNode.id() +")");

    }

    //funione di comodo che estrae un numero casuale compreso in [a,b]
    let randomize = (a, b) => {
      return Math.round(Math.random() * (+b - +a) + +a);
    }

    //deseleziona un nodo
    let deselectNode = (n) => {
        if (n!=null)
            setTimeout(function(){
                n.unselect();
            }, 25);
    };

    //resetta la costruzione dell'arco
    let resetDraw = () => {
        this.drawMode = false;
        if (this.sourceNode!=null) deselectNode(this.sourceNode);
        this.sourceNode = null;
    };

    //reimposta il layout
    let resetLayout = () => {

      var layout = this.cy.layout({
            name: 'cola'
      });

      layout.run();

    };

    this.cy = cs({

      container: document.getElementById('cy'), // container to render in

      elements: this.graph,

      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            shape: 'ellipse',
            'background-color': 'red',
            'border-color': 'black',
            'border-width': '2',
            'label': function(data){ return "["+data.id()+"]:"+data.data().weight; },
            'width' : 'data(weight)',
            'height' : 'data(weight)'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-color': 'black',
            'border-width': '3px',
            'background-color': 'lightgrey'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#aaa',
            'curve-style': 'straight',
            'target-arrow-shape': 'vee'
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': 'black',
            'target-arrow-color': 'black'
          }
        }
      ],

      layout: {
        name: 'random'
      },

      // initial viewport state:
      zoom: 1,
      pan: { x: 0, y: 0 },

      // interaction options:
      minZoom: 1e-50,
      maxZoom: 1e50,
      zoomingEnabled: true,
      userZoomingEnabled: true,
      panningEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      selectionType: 'single',
      touchTapThreshold: 8,
      desktopTapThreshold: 4,
      autolock: false,
      autoungrabify: false,
      autounselectify: false,

      // rendering options:
      headless: false,
      styleEnabled: true,
      hideEdgesOnViewport: false,
      hideLabelsOnViewport: false,
      textureOnViewport: false,
      motionBlur: false,
      motionBlurOpacity: 0.2,
      wheelSensitivity: 1,
      pixelRatio: 'auto'

    });

    //memorizza la posizione del mouse
    this.cy.bind("mousemove", function(e){this.position = e.position;});

    /**
     * click del mouse su un elemento o sul fondo
     */
    this.cy.on('tap', function(event){
      // target holds a reference to the originator
      // of the event (core or element)
      var evtTarget = event.target;

      //se si clicca ovunque resetto la costruzione dell'arco
      resetDraw();

      //non si capisce perché this è diventato quello che doveva essere this.cy
      //probabilmente perché sto dentro ad una funzione legata a this.cy
      if( evtTarget === this ){
        console.log('tap on background');

      } else {

        if (evtTarget.isNode()) {
            console.log('tap on node '+evtTarget.id()+', weight:'+evtTarget.data('weight'));

            //non seleziono al click (senza ritardo non funziona)
            deselectNode(evtTarget);

          } else
          if (evtTarget.isEdge()) {

            console.log('tap on edge '+evtTarget.id()+', weight:'+evtTarget.data('weight'));

          }

      }

    });

    // the default values of each option are outlined below:
    let defaultsNode = {
        menuRadius: 100, // the radius of the circular menu in pixels
        selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
        commands: [ // an array of commands to list in the menu or a function that returns the array

          { // example command
            fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
            content: '<span class="fa fa-edit fa-2x">'+iconLabel('Edit')+'</span>', // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: function(ele){ // a function to execute when the command is selected
              console.log( ele.id() ) // `ele` holds the reference to the active element
            },
            enabled: true // whether the command is selectable
          },
          { // example command
            fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
            content: '<span class="fa fa-trash fa-2x">'+iconLabel('delete')+'</span>', // html/text content to be displayed in the menu
            contentStyle: {'background-image': 'PushSubscriptionOptions.gif' }, // css key:value pairs to set the command's css in js if you want
            select: function(ele){ // a function to execute when the command is selected
              console.log( ele.id() ) // `ele` holds the reference to the active element
              //cancellazione del nodo
              ele.cy().remove( ele );
              resetDraw();
            },
            enabled: true // whether the command is selectable
          },
          { // example command
            fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
            content: '<span class="fa fa-external-link fa-2x">'+iconLabel('Link')+'</span>', // html/text content to be displayed in the menu
            contentStyle: {'background-image': 'PushSubscriptionOptions.gif' }, // css key:value pairs to set the command's css in js if you want
            select: selectLink,
            enabled: true // whether the command is selectable
          }

        ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
        fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
        activeFillColor: 'rgba(1, 105, 217, 0.75)', // the colour used to indicate the selected command
        indicatorSize: 24, // the size in pixels of the pointer to the active command
        separatorWidth: 3, // the empty spacing in pixels between successive commands
        spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
        minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight
        maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
        openMenuEvents: 'cxttapstart taphold', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
        itemColor: 'white', // the colour of text in the command's content
        itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
        zIndex: 9999, // the z-index of the ui div
        atMouse: false // draw menu at mouse position
      };

      let menuNode = this.cy.cxtmenu( defaultsNode );

      let defaultsEdge = {
        menuRadius: 100, // the radius of the circular menu in pixels
        selector: 'edge', // elements matching this Cytoscape.js selector will trigger cxtmenus
        commands: [ // an array of commands to list in the menu or a function that returns the array

          { // example command
            fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
            content: '<span class="fa fa-edit fa-2x">'+iconLabel('Edit')+'</span>', // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: function(ele){ // a function to execute when the command is selected
              console.log( ele.id() ) // `ele` holds the reference to the active element
            },
            enabled: true // whether the command is selectable
          },
          { // example command
            fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
            content: '<span class="fa fa-trash fa-2x">'+iconLabel('Delete')+'</span>', // html/text content to be displayed in the menu
            contentStyle: {'background-image': 'PushSubscriptionOptions.gif' }, // css key:value pairs to set the command's css in js if you want
            select: function(ele){ // a function to execute when the command is selected
              console.log( ele.id() ) // `ele` holds the reference to the active element
              //cancellazione dell'arco
              ele.cy().remove( ele );
            },
            enabled: true // whether the command is selectable
          }

        ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
        fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
        activeFillColor: 'rgba(1, 105, 217, 0.75)', // the colour used to indicate the selected command
        activePadding: 20, // additional size in pixels for the active command
        indicatorSize: 24, // the size in pixels of the pointer to the active command
        separatorWidth: 3, // the empty spacing in pixels between successive commands
        spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
        minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight
        maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
        openMenuEvents: 'cxttapstart taphold', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
        itemColor: 'white', // the colour of text in the command's content
        itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
        zIndex: 9999, // the z-index of the ui div
        atMouse: false // draw menu at mouse position
      };

      let menuEdge = this.cy.cxtmenu( defaultsEdge );

      let defaultsBackground = {
        menuRadius: 100, // the radius of the circular menu in pixels
        selector: 'core', // elements matching this Cytoscape.js selector will trigger cxtmenus
        commands: [ // an array of commands to list in the menu or a function that returns the array

          { // example command
            fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
            content: '<span class="fa fa-check fa-2x">'+iconLabel('Layout')+'</span>', // html/text content to be displayed in the menu
            contentStyle: {}, // css key:value pairs to set the command's css in js if you want
            select: function(ele){ // a function to execute when the command is selected
                resetLayout();
            },
            enabled: true // whether the command is selectable
          },
          { // example command
            fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
            content: '<span class="fa fa-plus-square fa-2x">'+iconLabel('Add')+'</span>', // html/text content to be displayed in the menu
            contentStyle: {'background-image': 'PushSubscriptionOptions.gif' }, // css key:value pairs to set the command's css in js if you want
            select: function(ele){ // a function to execute when the command is selected
                var pos = this.position;
                console.log(pos);
                //aggiungo un nodo con ID random (da verificare se esiste)
                var nodeId = randomize(1000,2000) + "";
                var eles = this.add([
                  { group: 'nodes', data: { id: nodeId , weight: '20'}, renderedPosition: pos }
                ]);
            },
            enabled: true // whether the command is selectable
          }

        ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
        fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
        activeFillColor: 'rgba(1, 105, 217, 0.75)', // the colour used to indicate the selected command
        activePadding: 20, // additional size in pixels for the active command
        indicatorSize: 24, // the size in pixels of the pointer to the active command
        separatorWidth: 3, // the empty spacing in pixels between successive commands
        spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
        minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight
        maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
        openMenuEvents: 'cxttapstart taphold', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
        itemColor: 'white', // the colour of text in the command's content
        itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
        zIndex: 9999, // the z-index of the ui div
        atMouse: false // draw menu at mouse position
      };

      let menuBackground = this.cy.cxtmenu( defaultsBackground );

  };

}
