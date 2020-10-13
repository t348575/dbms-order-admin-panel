import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {OrderModel} from '../../models/order-model';
import {OrderService} from '../../services/order.service';
import {ToastService} from '../../services/toast.service';
import {ShippingService} from '../../services/shipping.service';

@Component({
    selector: 'app-change-order-state',
    templateUrl: './change-order-state.component.html',
    styleUrls: ['./change-order-state.component.scss'],
})
export class ChangeOrderStateComponent implements OnInit {
    // tslint:disable-next-line:no-input-rename
    @Input('order') order: OrderModel;
    currentState;
    originalState;
    states: { name: string, value: number, disabled: boolean }[] = [
        {
            name: 'Awaiting confirmation',
            value: 0,
            disabled: true
        },
        {
            name: 'Packaging',
            value: 1,
            disabled: true
        },
        {
            name: 'Shipment sent',
            value: 2,
            disabled: true
        },
        {
            name: 'Shipment reached',
            value: 3,
            disabled: true
        },
        {
            name: 'Delivered',
            value: 4,
            disabled: true
        },
        {
            name: 'Cancelled',
            value: -1,
            disabled: true
        }
    ];
    constructor(
        private modalController: ModalController,
        private orderService: OrderService,
        private alertController: AlertController,
        private shipping: ShippingService
    ) { }
    ngOnInit() {
        this.currentState = this.order.state;
        this.originalState = this.currentState;
        for (const v of this.states) {
            if (v.value === this.currentState) {
                v.disabled = false;
            }
            v.disabled = v.value < this.currentState && v.value !== -1;
        }
    }
    close() {
        this.modalController.dismiss();
    }
    async confirm() {
        if (this.currentState !== this.originalState) {
            switch (this.currentState) {
                case 1: {
                    let success = false;
                    const alert = await this.alertController.create({
                        header: 'Confirm!',
                        message: 'Automatically update inventory?',
                        buttons: [
                            {
                                text: 'Do not auto update',
                                role: 'cancel',
                                cssClass: 'secondary'
                            }, {
                                text: 'Perform auto update',
                                handler: () => {
                                    const products = [];
                                    for (const v of this.order.ord_prod) {
                                        products.push({ prod_id: v.product.prod_id, count: v.count });
                                    }
                                    this.orderService.updateStock(this.order.ord_id, products)
                                        .subscribe((data: { status: boolean, failed: { prod_id: string, count: number }[] }) => {
                                            success = data.status;
                                            console.log(data.status);
                                            if (data.status) {
                                                ToastService.toast('Inventory updated successfully!');
                                                this.changeState();
                                            } else {
                                                ToastService.toast(`Update failed for ${data.failed.length} products!`, 3000, 'danger');
                                            }
                                        });
                                }
                            }
                        ]
                    });
                    await alert.present();
                    break;
                }
                case 2: {
                    this.shipping.addShipment(this.order.ord_id).subscribe((data: { status: boolean }) => {
                        if (data.status) {
                            ToastService.toast('Shipment added successfully!');
                            this.changeState();
                        } else {
                            ToastService.toast('Could not add shipment!', 3000, 'danger');
                        }
                    });
                    break;
                }
                default: {
                    this.changeState();
                    break;
                }
            }
        } else {
            this.modalController.dismiss();
            ToastService.toast('Same state selected!', 3000, 'warning');
        }
    }
    changeState() {
        this.orderService.changeOrderState(this.order.ord_id, this.currentState).subscribe(() => {
            ToastService.toast('Order state change successful!');
            this.modalController.dismiss();
        }, () => {
            ToastService.toast('Unsuccessful state change!', 3000, 'danger');
            this.modalController.dismiss();
        });
    }
}
