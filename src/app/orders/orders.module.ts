import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ViewOrderComponent} from './view-order/view-order.component';
import {ChangeOrderStateComponent} from './change-order-state/change-order-state.component';
import {ViewPaymentComponent} from '../view-payment/view-payment.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OrdersPageRoutingModule,
        NgxDatatableModule
    ],
  declarations: [
      OrdersPage,
      ViewOrderComponent,
      ChangeOrderStateComponent,
      ViewPaymentComponent
  ]
})
export class OrdersPageModule {}
