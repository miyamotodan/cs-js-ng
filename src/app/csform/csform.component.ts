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

  constructor() { }

  ngOnInit() {

    this.schema = {
      type: "object",
      properties: {
        id: { type: "string", minLength: 1, title: "id", description: "node id" },
        label: { type: "string", minLength: 3, title: "label", description: "node label" },
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

  }

  submit (d) {
    console.log(d);
    this.parent.receiveFormData(d);
    this.active=false;
  }

  setParent(p) {
    this.parent=p;
  }


  setData(d) {
    this.active=true;
    this.data=d;
  }

}
