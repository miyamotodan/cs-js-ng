import { Component } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

ngOnInit() {

  console.log("init");
  var title = 'cs-js-ng';

  $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });

}

}
