import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-csform',
  templateUrl: './csform.component.html',
  styleUrls: ['./csform.component.scss']
})
export class CsformComponent implements OnInit {

  public schema;
  public example;

  constructor() { }

  ngOnInit() {

    this.schema = {
      type: "object",
      properties: {
        name: { type: "string", minLength: 2, title: "Name", description: "Name or alias" },
        surname: { type: "string", minLength: 2, title: "Name", description: "surname" },
        title: {
          type: "string",
          enum: ['dr','jr','sir','mrs','mr','NaN','dj']
        }
      }
    }


    this.example = {
      first_name: "Jane", last_name: "Doe", age: 25, is_company: false,
      address: {
        street_1: "123 Main St.", street_2: null,
        city: "Las Vegas", state: "NV", zip_code: "89123"
      },
      phone_numbers: [
        { number: "702-123-4567", type: "cell" },
        { number: "702-987-6543", type: "work" }
      ], notes: ""
    };

  }

}
