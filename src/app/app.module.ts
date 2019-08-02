import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CscompComponent } from './cscomp/cscomp.component';
import { SettingsComponent } from './settings/settings.component';
import { CardComponent } from './card/card.component';

//per usare il client HTTP nell'applicazione
import { HttpClientModule } from '@angular/common/http';

import { MaterialDesignFrameworkModule } from 'angular7-json-schema-form';
import { CsformComponent } from './csform/csform.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    CscompComponent,
    SettingsComponent,
    CardComponent,
    CsformComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialDesignFrameworkModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
