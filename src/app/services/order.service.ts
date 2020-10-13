import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../../constants';
import * as qs from 'query-string';
@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private http: HttpClient) { }
    getOrders(page: number, pageSize: number, state: number, search: string, startDate, endDate) {
        const query = qs.stringify({ page, pageSize, state, search, startDate, endDate });
        return this.http.get(`${Constants.server}/order/getOrders?${query}`);
    }
    changeOrderState(ordId: string, newState: number) {
        return this.http.post(`${Constants.server}/order/changeState`, { ordId, newState });
    }
    updateStock(ordId: string, products: { prod_id: string, count: number }[]) {
        return this.http.post(`${Constants.server}/order/updateStock`, { ordId, products });
    }
}
