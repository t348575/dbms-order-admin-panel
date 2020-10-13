import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShippingPageRoutingModule } from './shipping-routing.module';

import { ShippingPage } from './shipping.page';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ShippingStatesComponent} from './shipping-states/shipping-states.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ShippingPageRoutingModule,
        NgxDatatableModule
    ],
  declarations: [
      ShippingPage,
      ShippingStatesComponent
  ]
})
export class ShippingPageModule {}
