import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() value: number;
  @Input() name: string;
  @Input() icon: string;

  constructor() { }

  ngOnInit() {

    console.log("card.parent");

  }

}
