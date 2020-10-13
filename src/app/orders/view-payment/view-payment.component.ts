import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {OrderModel} from '../../models/order-model';

@Component({
    selector: 'app-view-payment',
    templateUrl: './view-payment.component.html',
    styleUrls: ['./view-payment.component.scss'],
})
export class ViewPaymentComponent implements OnInit {
    // tslint:disable-next-line:no-input-rename
    @Input('order') order: OrderModel;
    constructor(private modalController: ModalController) { }
    ngOnInit() {}
    close() {
        this.modalController.dismiss();
    }
}
