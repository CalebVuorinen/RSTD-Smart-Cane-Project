import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cm-history',
  templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit {

    // displayMode: CustomerDisplayModeEnum;
    // displayModeEnum = CustomerDisplayModeEnum;

    constructor(private router: Router) { }

    ngOnInit() {

      // No longer needed due to routerLinkActive feature in Angular
      // const path = this.router.url.split('/')[3];
      // switch (path) {
      //   case 'details':
      //     this.displayMode = CustomerDisplayModeEnum.Details;
      //     break;
      //   case 'history':
      //     this.displayMode = CustomerDisplayModeEnum.history;
      //     break;
      //   case 'edit':
      //     this.displayMode = CustomerDisplayModeEnum.Edit;
      //     break;
      // }
    }

}

// enum CustomerDisplayModeEnum {
//   Details=0,
//   history=1,
//   Edit=2
// }
