import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ColumnMode} from '@swimlane/ngx-datatable';
import {OrderModel} from '../models/order-model';
import {OrderService} from '../services/order.service';
import {Globals} from '../../constants';
import {Roles} from '../models/role-model';
import {AuthService} from '../services/auth.service';
import {ModalController} from '@ionic/angular';
import {ViewOrderComponent} from './view-order/view-order.component';
import {ChangeOrderStateComponent} from './change-order-state/change-order-state.component';
import {ViewPaymentComponent} from '../view-payment/view-payment.component';
@Component({
    selector: 'app-orders',
    templateUrl: './orders.page.html',
    styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
    columnMode = ColumnMode.force;
    orders: OrderModel[] = [];
    pageNumber = 0;
    numPerPage = 25;
    loading = false;
    total = 0;
    state = 0;
    role = Roles.Empty;
    canChangeState = false;
    canViewPayment = false;
    search = '';
    startDate;
    endDate;
    @ViewChild('table') table;
    constructor(
        private orderService: OrderService,
        private cdr: ChangeDetectorRef,
        private auth: AuthService,
        private modalController: ModalController
    ) {
        this.setPage({ offset: 0 });
        this.role = this.auth.getRole();
        this.canChangeState = [0, 2, 5].indexOf(this.role) === -1;
        this.canViewPayment = [0, 1, 2, 3, 5].indexOf(this.role) === -1;
    }
    ngOnInit() {
    }
    setPage(pageInfo) {
        this.pageNumber = pageInfo.offset;
        this.loading = true;
        this.orderService.getOrders(this.pageNumber, this.numPerPage, this.state, this.search, this.startDate, this.endDate).subscribe(
            (data: { data: OrderModel[], total: number }) => {
                this.orders = data.data;
                this.orders = [...this.orders];
                this.total = data.total;
                this.loading = false;
                this.cdr.detectChanges();
            });
    }
    getDate(date) {
        return Globals.toMysqlFormat(new Date(date));
    }
    toggleExpandRow(row) {
        this.table.rowDetail.toggleExpandRow(row);
        this.cdr.detectChanges();
    }
    getState(state: number) {
        switch (state) {
            case 0: {
                return 'Awaiting confirmation';
            }
            case 1: {
                return 'Packaging';
            }
            case 2: {
                return 'Shipment sent';
            }
            case 3: {
                return 'Shipment reached';
            }
            case 4: {
                return 'Delivered';
            }
            case -1: {
                return 'Cancelled';
            }
        }
    }
    async viewOrder(row) {
        const modal = await this.modalController.create({
            component: ViewOrderComponent,
            cssClass: 'view-order',
            componentProps: {
                order: row as OrderModel
            }
        });
        await modal.present();
    }
    async changeOrderState(row) {
        const modal = await this.modalController.create({
            component: ChangeOrderStateComponent,
            cssClass: 'auto-height',
            componentProps: {
                order: row as OrderModel
            }
        });
        await modal.present();
        await modal.onWillDismiss();
        this.setPage({ offset: 0 });
    }
    async viewPayment(row) {
        const modal = await this.modalController.create({
            component: ViewPaymentComponent,
            cssClass: 'auto-height',
            componentProps: {
                payment: row.ord_payment
            }
        });
        await modal.present();
    }
    reset() {
        this.pageNumber = 0;
        this.numPerPage = 25;
        this.loading = false;
        this.total = 0;
        this.state = 0;
        this.search = '';
        this.startDate = undefined;
        this.endDate = undefined;
        this.setPage({ offset: 0 });
    }
}
