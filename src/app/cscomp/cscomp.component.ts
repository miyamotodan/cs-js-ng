import { Component, OnInit, ViewChild } from '@angular/core';
import { GraphRestApiService } from '../shared/graph-rest-api.service';

import * as $ from 'jquery';
import * as cs from 'cytoscape';
import * as cscola from 'cytoscape-cola';
import * as csctxm from 'cytoscape-cxtmenu';
import { Graph } from '../shared/graph';
import { CsformComponent } from '../csform/csform.component';

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
  private lyo: cs.Layout;

  //gestione della creazione di un arco
  private sourceNode = null;

  //gestione dell'edit di un nodo
  private editNode = null;

  //posizione del mouse
  private position = null;

  //archi e nodi del grafo
  private graph = null;
  private graphName = "";
  private graphId = "";
  private graphConfig = null;

  private totNodes = 0;
  private totEdges = 0;
  private meanCluster = 0;

  //componente figlio form
  @ViewChild(CsformComponent) child: CsformComponent ;

  constructor(public restApi: GraphRestApiService) {
    //all'inizio carica i dati
    this.load();
  }

  export() {
    alert('cscomp.export()');

    //TEST
    //configurazioni di cy
    //andrebbero salvate su file da componente di configurazione e poi ricaricate da questo 
    let cnf = this.cy.options();
    console.log(cnf.style);

  }

  //salvataggio dei dati sul json
  //TODO:deve salvare grafi diversi non solo quello con id=1
  save() {
    var g: Graph = new Graph();
    g.graph = this.cy.elements().jsons();
    g.id = "1";
    g.name = "nome";
    //funzione che attende il salvataggio dei dati facendo una subscribe al metodo che ritorna un promise
    this.restApi.updateGraph(g.id, g).subscribe((data: {}) => {
      console.log(data);
    });
  }

  //caricamento dei dati da json
  //TODO:deve caricare diversi grafi non solo quello all'inizio della lista data[0]
  load() {
    //funzione che attende il caricamento dei dati facendo una subscribe al metodo che ritorna un promise
    this.restApi.getGraphs().subscribe((data: {}) => {
      this.cy.elements().remove();
      //per ora prendo il primo grafo
      this.graph = data[0].graph;
      this.graphId = data[0].id;
      this.graphName = data[0].name
      console.log("cscomp.load : " + this.graphId + ", " + this.graphName + ", " + this.graph.length);
      //aggiungo gli elementi al grafo corrente
      this.cy.add(this.graph);
      //calcolo i valori riassuntivi
      this.computeValues();
    });

  }

  //imposto i valori del nodo nel form
  sendFormData = (n) => {
      this.editNode = n;
      this.child.setData(n[0].data());
      n.select();
      //apro l'accordion del form
      const el1 = $('#collapseOne');
      el1.removeClass('show').addClass('collapse');
      const el2 = $('#collapseTwo');
      el2.removeClass('collapse').addClass('show');
  }

  //imposto i valori del form nel nodo
  receiveFormData = (d) => {
      if(this.editNode!=null) {
          this.editNode.removeData();
          this.editNode.data(d);
          this.editNode.deselect();
      }
      this.editNode=null;
  }

  //ritorna l'oggetto cy
  getCy = () => {
    return this.cy;
  }

  //calcolo dei valori riassuntivi del grafo
  computeValues = () => {

    /**
     *  numero di archi
     */
    this.totEdges = this.cy.edges().length;

    /**
     *  numero di nodi
     */
    this.totNodes = this.cy.nodes().length;

    /**
     *  coefficiente di clustering medio (come se fosse non orientato)
     */
    //scorro tutti i nodi
    var ccm = 0;
    this.cy.nodes().forEach(element => {
      //prendo i vicini
      var nghMap = new Map();
      var ngh = element.neighborhood();
      ngh.forEach(n => {
        if (n.isNode()) {
          nghMap.set(n.id(), n);
        }
      });
      //conto gli archi tra i vicini
      var cnMap = new Map();
      nghMap.forEach(nn => {
        nn.neighborhood().forEach(p => {
          if (p.isEdge() && p.source().id() != element.id() && p.target().id() != element.id()) {
            if (nghMap.has(p.source().id()) && nghMap.has(p.target().id())) {
              cnMap.set(p.id(), p);
            }
          }
        })
      });
      const maxLink = nghMap.size * (nghMap.size - 1) * 0.5;
      if (maxLink > 0) ccm += cnMap.size / maxLink;
      this.meanCluster = -1;

    });
    ccm = ccm / this.totNodes;
    //arrotondo a due cifre decimali
    this.meanCluster = Number(ccm.toFixed(2));
  }

  //ridimensiona il canvas del grafo
  resetCySize = () => {
    let rect = this.cy.container().getBoundingClientRect()
    this.cy.resize();
    this.cy.fit();
  }

  ngOnInit() {
    //si dichiara al child
    this.child.setParent(this);

    // dichiaro una serie di funzioni per usarle nell funzioni definite per il menù contestuale

    //ritorna l'html per la label per l'icona del menu contestuale
    let iconLabel = (label) => {
      return '<span style="font-family: helvetica neue, helvetica, liberation sans, arial, sans-serif;font-size: 12px;display: block;text-align: left;">' + label + '</span>';
    }

    //funzione chiamata quando viene selezionato il menù contestuale del nodo per inserire un arco
    let selectLink = (ele) => {
      if (this.sourceNode!=null) {
        //chiudo l'arco
        var edgeId = this.sourceNode.id() + '-' + ele.id();
        var eles = ele.cy().add([
          { group: 'edges', data: { id: edgeId, source: this.sourceNode.id(), target: ele.id() } }
        ]);
        computeValues();
        resetDraw();
      } else {
        //apro l'arco
        this.sourceNode = ele;
        ele.select();
      }

      console.log("---");
      console.log("selectLink (" + ele.id() + ")");
      console.log("drawMode (" + (this.sourceNode!=null) + ")");
      if (this.sourceNode) console.log("sourceNode (" + this.sourceNode.id() + ")");

    }

    //funzione di comodo che estrae un numero casuale compreso in [a,b]
    let randomize = (a, b) => {
      return Math.round(Math.random() * (+b - +a) + +a);
    }

    //deseleziona un nodo con timeout
    let deselectNode = (n) => {
      if (n != null)
        setTimeout(function () {
          n.unselect();
        }, 25);
    };

    //resetta la costruzione dell'arco
    let resetDraw = () => {
      if (this.sourceNode!=null) {
        if (this.sourceNode != null) deselectNode(this.sourceNode);
        this.sourceNode = null;
      }
    };

    //resetta l'edit del nodo
    let resetEdit = () => {
      if (this.editNode) {
        this.editNode = null;
        this.child.setActive(false);
      }
    };

    //reimposta il layout
    let resetLayout = () => {
      this.lyo = this.cy.layout({
        name: 'cola'
      });
      this.lyo.run();
    };

    //associa le funzioni fuori dal metodo ngOnInit (verificare se è l'unico modo) per usarle nelle funzioni del menù
    let computeValues = this.computeValues;
    let sendFormData = this.sendFormData;
    let getCy = this.getCy;

    //inizializzo le configurazioni cytoscape
    this.cyConfig = {
      container: document.getElementById('cy'), // container to render in
      elements: this.graph,
      style: [ //stylesheet per il grafo, importante l'ordine
        {
          selector: 'node',
          style: {
            shape: 'ellipse',
            'background-color': '#f7cac9',
            'border-color': '#f7786b',
            'border-width': '2',
            'label': function (data) { return "[" + data.data().label + "]:" + data.data().weight; },
            
            'text-halign':'center',
            'text-valign':'center',
            
            'width': 'data(weight)',
            'height': 'data(weight)'
          }
        },
        {
          selector: 'node[class="standard"]',
          style: {
            'background-color': '#92a8d1',
            'border-color': '#034f84',
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-color': '#50394c',
            'border-width': '3',
            'background-color': '#ffef96'
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
      boxSelectionEnabled: true,
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
      wheelSensitivity: 0.1,
      pixelRatio: 'auto'

    };

    //creo il grafo con le sue impostazioni
    this.cy = cs(this.cyConfig);

    //memorizza la posizione del mouse
    this.cy.bind("mousemove", function (e) { this.position = e.position; });

    /**
     * click del mouse su un elemento o sul fondo
     */
    this.cy.on('tap', function (event) {
      // target holds a reference to the originator
      // of the event (core or element)
      var evtTarget = event.target;

      //se si clicca ovunque resetto la costruzione dell'arco perché si chiude solo col menù contestuale
      resetDraw();
      //se si clicca ovunque resetto l'editing del nodo'
      resetEdit();

      //non si capisce perché this è diventato quello che doveva essere this.cy
      //probabilmente perché sto dentro ad una funzione legata a this.cy
      if (evtTarget === this) {
        console.log('tap on background');

      } else {

        if (evtTarget.isNode()) {
          console.log('tap on node ' + evtTarget.id() + ', weight:' + evtTarget.data('weight'));

          //non seleziono al click (senza ritardo non funziona)
          //di default seleziona al click quindi qui deseleziono di nuovo
          deselectNode(evtTarget);

        } else
          if (evtTarget.isEdge()) {

            console.log('tap on edge ' + evtTarget.id() + ', weight:' + evtTarget.data('weight'));

          }

      }

    });

    /**
     * IMPOSTO I MENU CONTESTUALI
     */

    // the default values of each option are outlined below:
    let defaultsNode = {
      menuRadius: 100, // the radius of the circular menu in pixels
      selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
      commands: [ // an array of commands to list in the menu or a function that returns the array

        { // example command
          fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
          content: '<span class="fa fa-edit fa-2x">' + iconLabel('Edit') + '</span>', // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: function (ele) { // a function to execute when the command is selected
            //console.log(ele.id()); // `ele` holds the reference to the active element
            sendFormData(ele);
          },
          enabled: true // whether the command is selectable
        },
        { // example command
          fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
          content: '<span class="fa fa-trash fa-2x">' + iconLabel('delete') + '</span>', // html/text content to be displayed in the menu
          contentStyle: { 'background-image': 'PushSubscriptionOptions.gif' }, // css key:value pairs to set the command's css in js if you want
          select: function (ele) { // a function to execute when the command is selected
            //console.log(ele.id()) // `ele` holds the reference to the active element
            //cancellazione del nodo
            ele.cy().remove(ele);
            computeValues();
            resetDraw();
          },
          enabled: true // whether the command is selectable
        },
        { // example command
          fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
          content: '<span class="fa fa-external-link fa-2x">' + iconLabel('Link') + '</span>', // html/text content to be displayed in the menu
          contentStyle: { 'background-image': 'PushSubscriptionOptions.gif' }, // css key:value pairs to set the command's css in js if you want
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

    let menuNode = this.cy.cxtmenu(defaultsNode);

    let defaultsEdge = {
      menuRadius: 100, // the radius of the circular menu in pixels
      selector: 'edge', // elements matching this Cytoscape.js selector will trigger cxtmenus
      commands: [ // an array of commands to list in the menu or a function that returns the array

        { // example command
          fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
          content: '<span class="fa fa-edit fa-2x">' + iconLabel('Edit') + '</span>', // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: function (ele) { // a function to execute when the command is selected
            console.log(ele.id()) // `ele` holds the reference to the active element
          },
          enabled: true // whether the command is selectable
        },
        { // example command
          fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
          content: '<span class="fa fa-trash fa-2x">' + iconLabel('Delete') + '</span>', // html/text content to be displayed in the menu
          contentStyle: { 'background-image': 'PushSubscriptionOptions.gif' }, // css key:value pairs to set the command's css in js if you want
          select: function (ele) { // a function to execute when the command is selected
            //console.log(ele.id()) // `ele` holds the reference to the active element
            //cancellazione dell'arco
            ele.cy().remove(ele);
            computeValues();
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

    let menuEdge = this.cy.cxtmenu(defaultsEdge);

    let defaultsBackground = {
      menuRadius: 100, // the radius of the circular menu in pixels
      selector: 'core', // elements matching this Cytoscape.js selector will trigger cxtmenus
      commands: [ // an array of commands to list in the menu or a function that returns the array

        { // example command
          fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
          content: '<span class="fa fa-check fa-2x">' + iconLabel('Layout') + '</span>', // html/text content to be displayed in the menu
          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
          select: function (ele) { // a function to execute when the command is selected
            resetLayout();
          },
          enabled: true // whether the command is selectable
        },
        { // example command
          fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
          content: '<span class="fa fa-plus-square fa-2x">' + iconLabel('Add') + '</span>', // html/text content to be displayed in the menu
          contentStyle: { 'background-image': 'PushSubscriptionOptions.gif' }, // css key:value pairs to set the command's css in js if you want
          select: function (ele) { // a function to execute when the command is selected
            var pos = this.position;
            //console.log(pos);
            //aggiungo un nodo con l'ID = max(ID)+1
            let nodeId = getCy().nodes().max(function(i){console.log(i);return i.data().id});
            console.log(nodeId);

            let newId : number = (nodeId.ele==null) ? 0 : Number(nodeId.ele.id());
            newId++;
            console.log(newId);
            var eles = this.add([
              { group: 'nodes', data: { id: ""+newId, weight: 10, type: "", class: "", label: "" }, renderedPosition: pos }
            ]);
            computeValues();
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

    let menuBackground = this.cy.cxtmenu(defaultsBackground);

  };

}
