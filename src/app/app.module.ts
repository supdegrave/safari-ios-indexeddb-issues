import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IndexedDbService } from './indexeddb.service';

@NgModule({
  imports: [ BrowserModule, FormsModule ],
  providers: [ IndexedDbService ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
