import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../../constants';
import * as qs from 'query-string';

@Injectable({
    providedIn: 'root'
})
export class ShippingService {
    constructor(private http: HttpClient) { }
    addShipment(ordId: string) {
        return this.http.post(`${Constants.server}/shipping/addShipment`, { ordId });
    }
    getShipments(page: number, pageSize: number, search: string, startDate, endDate) {
        const query = qs.stringify({ page, pageSize, search, startDate, endDate });
        return this.http.get(`${Constants.server}/shipping/getShipments?${query}`);
    }
    getShipment(shipId: string) {
        const query = qs.stringify({ shipId });
        return this.http.get(`${Constants.server}/shipping/getShipment?${query}`);
    }
    addStatus(status: { time: string, value: string }, shipId: string, updateOrder: boolean, ordId: string, state: number) {
        return this.http.post(`${Constants.server}/shipping/addStatus`, { status, shipId, updateOrder: +updateOrder, ordId, state });
    }
    removeStatus(index: number, shipId: string) {
        return this.http.post(`${Constants.server}/shipping/removeStatus`, { index, shipId });
    }
}
