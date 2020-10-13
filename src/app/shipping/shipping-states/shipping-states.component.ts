import {Component, Input, OnInit} from '@angular/core';
import {ShipmentModel} from '../../models/shipment-model';
import {ShippingService} from '../../services/shipping.service';
import {AlertController, ModalController} from '@ionic/angular';
import {Globals} from '../../../constants';
import {ToastService} from '../../services/toast.service';

@Component({
    selector: 'app-shipping-states',
    templateUrl: './shipping-states.component.html',
    styleUrls: ['./shipping-states.component.scss'],
})
export class ShippingStatesComponent implements OnInit {
    // tslint:disable-next-line:no-input-rename
    @Input('shipment') shipment: ShipmentModel;
    states: {
        time: string,
        value: string
    }[];
    add = false;
    statusText = '';
    statusDate;
    updateOrder = false;
    orderStatus = 3;
    constructor(private shipping: ShippingService, private modalController: ModalController, private alertController: AlertController) { }
    ngOnInit() {
        this.states = this.shipment.ship_status;
        this.orderStatus = this.shipment.state + 1;
        if (this.shipment.state === -1) {
            this.orderStatus = -1;
        }
}
    close() {
        this.modalController.dismiss();
    }
    getDate(val) {
        return Globals.toMysqlFormat(new Date(val));
    }
    setStatus() {
        if (this.updateOrder) {
            switch (this.orderStatus) {
                case 3: {
                    this.statusText = 'Shipment reached';
                    break;
                }
                case 4: {
                    this.statusText = 'Shipment delivered';
                    break;
                }
                case 5: {
                    this.statusText = 'Shipment cancelled';
                    break;
                }
            }
        }
    }
    getShipment() {
        this.shipping.getShipment(this.shipment.ship_id).subscribe((data: ShipmentModel) => {
            this.shipment = data;
            this.states = this.shipment.ship_status;
        });
    }
    addStatus() {
        this.shipping.addStatus(
            { time: Globals.toMysqlFormat(new Date(this.statusDate)), value: this.statusText },
            this.shipment.ship_id,
            this.updateOrder,
            this.shipment.ord_id,
            this.orderStatus
        )
            .subscribe(() => {
                this.statusDate = undefined;
                this.statusText = '';
                this.add = !this.add;
                this.getShipment();
        }, () => {
                this.statusDate = undefined;
                this.statusText = '';
                this.add = !this.add;
                this.getShipment();
                ToastService.toast('Could not add status!', 3000, 'danger');
        });
    }
    setNow() {
        this.statusDate = Globals.toMysqlFormat(new Date());
    }
    async removeStatus(index: number) {
        const alert = await this.alertController.create({
            header: 'Confirm!',
            message: 'Delete status: ' + this.states[index].value,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Delete',
                    handler: () => {
                        this.shipping.removeStatus(index, this.shipment.ship_id).subscribe(() => {
                            this.getShipment();
                        }, () => {
                            this.getShipment();
                            ToastService.toast('Could not remove status!', 3000, 'danger');
                        });
                    }
                }
            ]
        });
        await alert.present();
    }
}
