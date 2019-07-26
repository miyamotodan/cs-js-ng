import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() name: string;
  @Input() icon: string;
  @Input() type: string;

  private value:number;

  constructor() { }

  ngOnInit() {

    this.value=this.compute(this.type);

  }

  compute = (type) => {
    
    var res = 0;
    res = Math.round(Math.random() * 10);
    switch (type) {
      case 'node-count':
        //conteggio nodi
        break;
      case 'edge-count':
        //conteggio archi
        break;
    }
    return res;
  }




}
