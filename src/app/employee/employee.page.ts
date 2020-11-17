import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ColumnMode} from '@swimlane/ngx-datatable';
import {OrderModel} from '../models/order-model';
import {Roles} from '../models/role-model';
import {AuthService} from '../services/auth.service';
import {EmployeeService} from '../services/employee.service';
import {ModalController} from '@ionic/angular';
import {Globals} from '../../constants';
import {EmployeeModel} from '../models/employee-model';
import {ViewPaymentComponent} from '../view-payment/view-payment.component';

@Component({
    selector: 'app-employee',
    templateUrl: './employee.page.html',
    styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {
    columnMode = ColumnMode.force;
    orders: EmployeeModel[] = [];
    pageNumber = 0;
    numPerPage = 25;
    loading = false;
    total = 0;
    dir: 'asc' | 'desc' = 'asc';
    sortBy = 'emp_name';
    jobTitle = 'Any Job Title';
    role = Roles.Empty;
    canViewPayment = false;
    search = '';
    @ViewChild('table') table;
    constructor(
        private employeeService: EmployeeService,
        private cdr: ChangeDetectorRef,
        private auth: AuthService,
        private modalController: ModalController
    ) {
        this.setPage({ offset: 0 });
        this.role = this.auth.getRole();
        this.canViewPayment = [0, 1, 2, 3, 4, 5].indexOf(this.role) === -1;
    }
    ngOnInit() {
    }
    setPage(pageInfo) {
        this.pageNumber = pageInfo.offset;
        this.loading = true;
        // tslint:disable-next-line:max-line-length
        this.employeeService.getEmployees(this.pageNumber, this.numPerPage, this.jobTitle, this.search, this.dir, this.sortBy).subscribe(
            (data: { data: EmployeeModel[], total: number }) => {
                console.log(data);
                this.orders = data.data;
                this.orders = [...this.orders];
                this.total = data.total;
                this.loading = false;
                this.cdr.detectChanges();
            });
    }
    reset() {
    }
    toggleExpandRow(row) {
        console.log(row);
        this.table.rowDetail.toggleExpandRow(row);
        this.cdr.detectChanges();
    }
    getDate(date) {
        return Globals.toMysqlFormat(new Date(date)).slice(0, 10);
    }
    async viewPayment(row) {
        const modal = await this.modalController.create({
            component: ViewPaymentComponent,
            cssClass: 'auto-height',
            componentProps: {
                payment: row.emp_payment
            }
        });
        await modal.present();
    }
    sort(event) {
        this.loading = true;
        this.sortBy = event.sorts[0].prop;
        this.dir = event.sorts[0].dir;
        this.setPage({ offset: 0 });
    }
}
