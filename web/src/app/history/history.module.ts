import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HistoryRoutingModule } from './history-routing.module';

@NgModule({
  imports: [SharedModule, HistoryRoutingModule],
  declarations: [HistoryRoutingModule.components]
})
export class HistoryModule { }
