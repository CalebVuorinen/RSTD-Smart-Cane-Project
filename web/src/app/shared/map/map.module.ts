import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map.component';
import { MapPointComponent } from './mapPoint.component';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, OwlDateTimeModule, OwlNativeDateTimeModule, FormsModule],
  exports: [MapComponent, MapPointComponent],
  declarations: [MapComponent, MapPointComponent]
})
export class MapModule { }
