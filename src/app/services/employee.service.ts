import { Injectable } from '@angular/core';
import * as qs from 'query-string';
import {Constants} from '../../constants';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    constructor(private http: HttpClient) { }
    getEmployees(page: number, pageSize: number, jobTitle: string, search: string, dir: 'asc' | 'desc', sortBy: string) {
        const query = qs.stringify({ page, pageSize, jobTitle, search, dir, sortBy });
        return this.http.get(`${Constants.server}/employee/getEmployees?${query}`);
    }
}
