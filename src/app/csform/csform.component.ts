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

  private data;
  private schema;
  private form;

  constructor() { }

  ngOnInit() {

    this.schema = {
      type: "object",
      properties: {
        id: { type: "string", minLength: 1, title: "id", description: "node id" },
        label: { type: "string", minLength: 3, title: "label", description: "node label", pattern: "^\\S+$"},
        weight: { type: "number", minLength: 1, title: "weight", description: "node weight" },
        type: { type: "string", minLength: 1, title: "type", description: "node type" },
        class: { type: "string", minLength: 1, title: "class", description: "node class" }
      }
    }

    this.data = {
      id: "",
      weight: 10,
      type: "",
      class: "",
      label: ""
    };

    this.form = [
        
        //{ key: "id", type: "number" },
        { key: "label", type: "text" },
        { key: "weight", type: "number" },
        { key: "type", type: "text" },
        { key: "class", type: "text" },
        { type: 'submit', title: 'Salva dati' }
      
    ];

  }

  setActive(b) {
      this.active=b
  }

  submit (d) {
    console.log(d);
    if (d!=null) {
      this.parent.receiveFormData(d);
      this.active=false;
    }
  }

  setParent(p) {
    this.parent=p;
  }


  setData(d) {
    this.active=true;
    this.data=d;
  }

}
