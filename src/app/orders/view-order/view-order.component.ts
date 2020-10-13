import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {OrderModel} from '../../models/order-model';
import {ProductsService} from '../../services/products.service';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-view-order',
    templateUrl: './view-order.component.html',
    styleUrls: ['./view-order.component.scss'],
})
export class ViewOrderComponent implements OnInit {
    @Input('order') order: OrderModel;
    constructor(private productsService: ProductsService, private cdr: ChangeDetectorRef, private modalController: ModalController) { }
    ngOnInit() {
        const products = this.order.ord_prod.map(a => a.product.prod_id);
        this.productsService.getProductsByID(products).subscribe(data => {
            for (const v of data) {
                this.order.ord_prod[this.order.ord_prod.findIndex(a => a.product.prod_id === v.prod_id)].product = v;
            }
            this.cdr.detectChanges();
        });
    }
    close() {
        this.modalController.dismiss();
    }
}
