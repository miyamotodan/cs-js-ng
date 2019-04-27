import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

  import {CscompComponent} from "./cscomp/cscomp.component";
  import {SettingsComponent} from "./settings/settings.component";

const routes: Routes = [


{path: '', redirectTo: '/cytoscape', pathMatch: 'full'},
{path: 'cytoscape' , component: CscompComponent},
{path: 'settings' , component: SettingsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
