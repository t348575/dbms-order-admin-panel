import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProductModel} from '../models/product-model';
import {Constants} from '../../constants';
import * as qs from 'query-string';
@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    constructor(private http: HttpClient) { }
    getProductsByID(ids: string[], admin = 0): Observable<ProductModel[]> {
        return new Observable<ProductModel[]>(observer => {
            const query = qs.stringify({ids, admin});
            this.http.get(`${Constants.server}/products/byId?${query}`).subscribe((data: ProductModel[]) => {
                observer.next(data);
                observer.complete();
            });
        });
    }
    getProducts(page: number, pageSize: number, dir: 'asc' | 'desc', sortBy: string, search: string) {
        const query = qs.stringify({ page, pageSize, dir, sortBy, search });
        return this.http.get(`${Constants.server}/products/get?${query}`);
    }
    getExtension(name: string) {
        const i = name.lastIndexOf('.');
        return (i < 0) ? '' : name.substr(i);
    }
    uploadImage(image: any, prodId: string) {
        const form = new FormData();
        form.append('extension', this.getExtension(image.name));
        form.append('prodId', prodId);
        form.append('file', image, image.name);
        return this.http.post(`${Constants.server}/products/uploadImage`, form);
    }
    updateProduct(
        name: string,
        desc: string,
        stock: number,
        dim: { x: number, y: number, z: number, w: number } | number,
        feat: any,
        price: number,
        rating: number,
        type: boolean | number,
        prodId: string
        ) {
        return this.http.post(`${Constants.server}/products/updateProduct`, {
            name,
            desc,
            stock,
            dim,
            feat,
            price,
            rating,
            type,
            prodId
        });
    }
}
