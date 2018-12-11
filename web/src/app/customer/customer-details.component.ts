import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ICustomer } from '../shared/interfaces';
import { DataService } from '../core/services/data.service';
import * as moment from 'moment';

@Component({
  selector: 'cm-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  customer: ICustomer;
  mapEnabled: boolean;

  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
    // Subscribe to params so if it changes we pick it up. Could use this.route.parent.snapshot.params["id"] to simplify it.
    this.route.parent.params.subscribe((params: Params) => {
      const id = params['id'];
      if (id) {
        this.dataService.getCustomer(id)
          .subscribe((customer: ICustomer) => {
            this.customer = customer;
            this.mapEnabled = true;

            console.log('---------------');
            console.log(customer.locations);
            for (const location of customer.locations) {
              if (location.dateTime == null && location.date != null && location.time){
                location.dateTime = new Date(moment(location.date + location.time, 'DD/MM/YYYYhh:mm:ss.SS').toDate());
              }
            }
          });
      }
    });
  }


}
