import { Component } from '@angular/core';
import * as $ from 'jquery';
import * as cs from 'cytoscape';
import { CscompComponent } from './cscomp/cscomp.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

//componente che contiene cy
private child:CscompComponent;

//cytoscape
private cy: cs.core;


//bottone di salvataggio 
save = () => {

    //alert("app.save()");
    //chiamo il metodo save del componente attualmente caricato nella router-applet
    this.child.save();
    
};

//bottone di caricamento 
load = () => {

  //chiamo il metodo load del componente attualmente caricato nella router-applet
  this.child.load();
  
};

onActivate(componentRef){
  this.child=componentRef;

  console.log(componentRef);

}



collapse = () => {

  //alert("collapse");
  $('#sidebar').toggleClass('active');
  setTimeout( () => { this.child.resetCySize() }, 400 );
  setTimeout( () => { this.child.resetCySize() }, 500 );
  /*

  //this.cy =this.child.getCy();
  //console.log(this.cy.elements());
  //this.cy.resize();
  //this.cy.fit();
  //$('#cy').addClass('col-12');

  //$('#cy').addClass('w-100');
  $('#cy').width('100%');
  
  var elements = $("#cy div").filter(function() {
    return $(this).css("z-index") === "0";
  });
  
  console.log(elements);
  
  elements.addClass('w-100');
  elements.width('100%');
  
  for (var j = 0; j < elements.length; j++) {

    let w = elements[j].parentElement.parentElement.clientWidth;
    
    let ww=w+"px";

    console.log (ww);

    for (var i = 0; i < elements[j].childNodes.length; i++) {
      elements[j].childNodes[i].style.width = ww;
      elements[j].childNodes[i].width = ww;
      console.log ("j:"+j+", i:"+i);
    }
  }
  
  */

  //console.log($('#cy').parent());
  //$('#cy').parent().width('auto');
  //console.log($('#cy div[style=]')); 
  
}; 

ngOnInit() {

  console.log("init");
  var title = 'cs-js-ng';

}

}
