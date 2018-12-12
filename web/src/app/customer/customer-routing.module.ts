import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerComponent } from './customer.component';
import { CustomerHistoryComponent } from './customer-history.component';
import { CustomerDetailsComponent } from './customer-details.component';
import { CustomerEditComponent } from './customer-edit.component';
import { CanActivateGuard } from './can-activate.guard';
import { CanDeactivateGuard } from './can-deactivate.guard';
import {CustomerVideoComponent} from "./customer-video.component";

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
    children: [
      { path: 'history', component: CustomerHistoryComponent },
      { path: 'details', component: CustomerDetailsComponent },
      { path: 'video', component: CustomerVideoComponent },
      {
        path: 'edit',
        component: CustomerEditComponent,
        canActivate: [CanActivateGuard],
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanActivateGuard, CanDeactivateGuard]
})
export class CustomerRoutingModule {
  static components = [CustomerComponent, CustomerHistoryComponent, CustomerDetailsComponent,
    CustomerVideoComponent, CustomerEditComponent
  ];
}

