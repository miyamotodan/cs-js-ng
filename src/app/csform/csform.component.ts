import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-csform',
  templateUrl: './csform.component.html',
  styleUrls: ['./csform.component.scss']
})
export class CsformComponent implements OnInit {

  //cscomp
  private parent;

  private active=false;

  //configurazioni usate dal componente per il form
  private data;
  private schema;
  private form;

  //definizione dei diversi form possibili
  
  //nodo
  private nodeFormData;
  private nodeFormSchema;
  private nodeFormForm;
  //arco
  private edgeFormData;
  private edgeFormSchema;
  private edgeFormForm;

  constructor() { }

  ngOnInit() {

    this.nodeFormSchema = {
      type: "object",
      properties: {
        id: { type: "string", minLength: 1, title: "id", description: "node id" },
        label: { type: "string", minLength: 3, title: "label", description: "node label", pattern: "^\\S+$"},
        weight: { type: "number", minLength: 1, title: "weight", description: "node weight" },
        type: { type: "string", minLength: 1, title: "type", description: "node type" },
        class: { type: "string", minLength: 1, title: "class", description: "node class" }
      }
    }

    this.edgeFormSchema = {
      type: "object",
      properties: {
        id: { type: "string" },
        source: { type: "string" },
        target: { type: "string" },
        weight: { type: "number" },
        type: { type: "string" }
      }
    }

    /*
    this.nodeFormData = {
      id: "",
      weight: 10,
      type: "",
      class: "node",
      label: ""
    };

    this.edgeFormData = {
      id: "",
      weight: 0,
      type: "edge",
      class: "",
      label: ""
    };
    */

    this.nodeFormForm = [
        
        //{ key: "id", type: "text" },
        { key: "label", type: "text" },
        { key: "weight", type: "number" },
        { key: "type", type: "text" },
        { key: "class", type: "text" },
        { type: 'submit', title: 'Salva dati' }
      
    ];

    this.edgeFormForm = [
        
      //{ key: "id", type: "text" },
      { key: "weight", type: "number" }
      
  ];

  }

  setForm(t:string) {

    if (t=="node") {
      this.data = this.nodeFormData;
      this.form = this.nodeFormForm;
      this.schema = this.nodeFormSchema;
    } else 
    if (t=="edge") {
      this.data = this.edgeFormData;
      this.form = this.edgeFormForm;
      this.schema = this.edgeFormSchema;
    }

  }

  setActive(b:boolean) {
      this.active=b
  }

  submit (d:any) {
    console.log(d);
    if (d!=null) {
      this.parent.receiveFormData(d);
      this.active=false;
    }
  }

  setParent(p:any) {
    this.parent=p;
  }


  setData(d:any) {
    this.active=true;
    this.data=d;
  }

}
