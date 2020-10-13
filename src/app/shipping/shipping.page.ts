import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ColumnMode} from '@swimlane/ngx-datatable';
import {Roles} from '../models/role-model';
import {ShippingService} from '../services/shipping.service';
import {AuthService} from '../services/auth.service';
import {ModalController} from '@ionic/angular';
import {ShipmentModel} from '../models/shipment-model';
import {Globals} from '../../constants';
import {ShippingStatesComponent} from './shipping-states/shipping-states.component';

@Component({
    selector: 'app-shipping',
    templateUrl: './shipping.page.html',
    styleUrls: ['./shipping.page.scss'],
})
export class ShippingPage implements OnInit {
    columnMode = ColumnMode.force;
    shipments: ShipmentModel[] = [];
    pageNumber = 0;
    numPerPage = 25;
    loading = false;
    total = 0;
    role = Roles.Empty;
    search = '';
    startDate;
    endDate;
    viewStates = false;
    @ViewChild('table') table;
    constructor(
        private shippingService: ShippingService,
        private auth: AuthService,
        private modalController: ModalController,
        private cdr: ChangeDetectorRef
    ) {
        this.setPage({ offset: 0 });
        this.role = this.auth.getRole();
        this.viewStates = [0, 3, 5, 7].indexOf(this.role) === -1;
    }
    ngOnInit() {
    }
    reset() {
        this.pageNumber = 0;
        this.numPerPage = 25;
        this.loading = false;
        this.total = 0;
        this.search = '';
        this.startDate = undefined;
        this.endDate = undefined;
        this.viewStates = false;
        this.setPage({ offset: 0 });
    }
    setPage(pageInfo) {
        this.pageNumber = pageInfo.offset;
        this.loading = true;
        this.shippingService.getShipments(this.pageNumber, this.numPerPage, this.search, this.startDate, this.endDate).subscribe(
            (data: { data: ShipmentModel[], total: number }) => {
                this.shipments = data.data;
                this.shipments = [...this.shipments];
                this.total = data.total;
                this.loading = false;
                this.cdr.detectChanges();
            });
    }
    toggleExpandRow(row) {
        this.table.rowDetail.toggleExpandRow(row);
        this.cdr.detectChanges();
    }
    getDate(val) {
        return Globals.toMysqlFormat(new Date(val));
    }
    getPhone(val) {
        const num = val.slice(-10);
        return `+${val.slice(0, val.length - 10)} ${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6)}`;
    }
    async stateControl(row) {
        const modal = await this.modalController.create({
            component: ShippingStatesComponent,
            cssClass: 'view-order',
            componentProps: {
                shipment: row as ShipmentModel
            }
        });
        await modal.present();
        await modal.onWillDismiss();
        this.setPage({ offset: 0 });
    }
}
