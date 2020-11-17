import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../../constants';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    data = {
        uptime: '0',
        customers: 0,
        employees: 0,
        orders: 0,
        products: 0,
        revenue: 0
    };
    constructor(private http: HttpClient) {
        this.http.get(`${Constants.server}/home`).subscribe((data: any) => {
            this.data = data;
        });
    }

    ngOnInit() {
    }

}
