import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ProductsService} from '../../services/products.service';
import {ModalController} from '@ionic/angular';
import {ProductModel} from '../../models/product-model';
import {ToastService} from '../../services/toast.service';

@Component({
    selector: 'app-view-detailed',
    templateUrl: './view-detailed.component.html',
    styleUrls: ['./view-detailed.component.scss'],
})
export class ViewDetailedComponent implements OnInit {
    // tslint:disable-next-line:no-input-rename
    @Input('product') product: ProductModel;
    @Input('edit') edit: boolean;
    features: { name: string, value: string}[] = [];
    type = 'Single';
    @ViewChild('image') image: ElementRef;
    constructor(
        private productService: ProductsService,
        private modalController: ModalController,
        private cdr: ChangeDetectorRef
    ) { }
    ngOnInit() {
        this.features = [];
        // tslint:disable-next-line:forin
        for (const v in this.product.prod_feat) {
            this.features.push({ name: v, value: this.product.prod_feat[v] });
        }
        if (this.product.prod_type) {
            this.type = 'By weight';
        } else {
            this.type = 'Single';
        }
        this.cdr.detectChanges();
    }
    change(type: 'x' | 'y' | 'z' | 'w', event: any) {
        if (typeof this.product.prod_dim !== 'number') {
            switch (type) {
                case 'w': {
                    this.product.prod_dim.w = event.target.value;
                    break;
                }
                case 'x': {
                    this.product.prod_dim.x = event.target.value;
                    break;
                }

                case 'y': {
                    this.product.prod_dim.y = event.target.value;
                    break;
                }

                case 'z': {
                    this.product.prod_dim.z = event.target.value;
                    break;
                }
            }
        }
    }
    close() {
        this.modalController.dismiss();
    }
    swapType() {
        if (this.product.prod_type) {
            this.type = 'By weight';
            this.product.prod_dim = 0;
        } else {
            this.type = 'Single';
            this.product.prod_dim = { x: 0, y: 0, z: 0, w: 0 };
        }
    }
    upload() {
        if (this.image.nativeElement.files && this.image.nativeElement.files[0]) {
            this.productService.uploadImage(
                this.image.nativeElement.files[0],
                this.product.prod_id
            ).subscribe(() => {
                this.image.nativeElement.value = '';
                this.productService.getProductsByID([this.product.prod_id], 1).subscribe(data => {
                    this.product = data[0];
                    this.ngOnInit();
                });
            }, () => {
                ToastService.toast('Image could not be uploaded!', 3000, 'danger');
            });
        }
    }
    addFeature() {
        this.features.push({ name: '', value: '' });
    }
    removeFeature(idx: number) {
        this.features.splice(idx, 1);
    }
    update() {
        this.product.prod_feat = {};
        for (const v of this.features) {
            this.product.prod_feat[v.name] = v.value;
        }
        this.productService.updateProduct(
            this.product.prod_name,
            this.product.prod_desc,
            this.product.prod_stock,
            this.product.prod_dim,
            this.product.prod_feat,
            this.product.prod_price,
            this.product.prod_rating,
            typeof this.product.prod_type === 'boolean' ? +this.product.prod_type : this.product.prod_type,
            this.product.prod_id
        ).subscribe(() => {
            this.productService.getProductsByID([this.product.prod_id], 1).subscribe(data => {
                this.product = data[0];
                this.ngOnInit();
            });
        }, () => {
            ToastService.toast('Could not update product!', 3000, 'danger');
        });
    }
}
