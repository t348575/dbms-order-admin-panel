import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ProductsService} from '../services/products.service';
import {ProductModel} from '../models/product-model';
import {ColumnMode} from '@swimlane/ngx-datatable';
import {Roles} from '../models/role-model';
import {AuthService} from '../services/auth.service';
import {ModalController} from '@ionic/angular';
import {ViewDetailedComponent} from './view-detailed/view-detailed.component';

@Component({
    selector: 'app-products',
    templateUrl: './products.page.html',
    styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
    products: ProductModel[] = [];
    columnMode = ColumnMode.force;
    pageNumber = 0;
    numPerPage = 25;
    loading = false;
    total = 0;
    role = Roles.Empty;
    search = '';
    dir: 'asc' | 'desc' = 'asc';
    edit = false;
    sortBy = 'prod_name';
    relations = '';
    @ViewChild('table') table;
    searchColumns = ['prod_name', 'prod_desc'];
    queries = [];
    columns = [
        {
            name: 'ID',
            value: 'prod_id'
        },
        {
            name: 'Name',
            value: 'prod_name'
        },
        {
            name: 'Description',
            value: 'prod_desc'
        },
        {
            name: 'Image',
            value: 'prod_img'
        },
        {
            name: 'Features',
            value: 'prod_feat'
        },
        {
            name: 'Dimensions',
            value: 'prod_dim'
        },
        {
            name: 'Type',
            value: 'prod_type'
        },
        {
            name: 'Price',
            value: 'prod_price'
        },
        {
            name: 'Stock',
            value: 'prod_stock'
        },
        {
            name: 'Rating',
            value: 'prod_rating'
        }
    ];
    addQuery() {
        this.queries.push({
            column: 'prod_name',
            operators: [
                {
                    name: 'Equals',
                    value: '='
                },
                {
                    name: 'Not Equal',
                    value: '!='
                },
                {
                    name: 'Contains',
                    value: '%'
                },
                {
                    name: 'Does not contain',
                    value: '!%'
                }
            ],
            operator: '%',
            operatesOn: ['value', 'column'],
            operateOn: 'value',
            operateValue: ''
        });
    }
    removeQuery(index: number) {
        this.queries.splice(index, 1);
    }
    constructor(
        private productsService: ProductsService,
        private cdr: ChangeDetectorRef,
        private auth: AuthService,
        private modalController: ModalController
    ) {
        this.setPage({ offset: 0 });
        this.role = this.auth.getRole();
        this.edit = [0, 1, 2, 4, 8].indexOf(this.role) === -1;
    }
    ngOnInit() {
    }
    setPage(pageInfo) {
        this.pageNumber = pageInfo.offset;
        this.loading = true;
        if (this.queries.length > 0) {
            this.productsService.filterProducts(
                this.pageNumber,
                this.numPerPage,
                this.dir,
                this.sortBy,
                this.search,
                this.searchColumns,
                this.queries,
                this.relations
            ).subscribe(
                (data: { data: ProductModel[], total: number }) => {
                    this.products = data.data;
                    this.products = [...this.products];
                    this.total = data.total;
                    this.loading = false;
                    this.cdr.detectChanges();
                });
        } else {
            // tslint:disable-next-line:max-line-length
            this.productsService.getProducts(this.pageNumber, this.numPerPage, this.dir, this.sortBy, this.search, this.searchColumns).subscribe(
                (data: { data: ProductModel[], total: number }) => {
                    this.products = data.data;
                    this.products = [...this.products];
                    this.total = data.total;
                    this.loading = false;
                    this.cdr.detectChanges();
                });
        }
    }
    reset() {
        this.pageNumber = 0;
        this.numPerPage = 25;
        this.loading = false;
        this.total = 0;
        this.search = '';
        this.dir = 'asc';
        this.sortBy = 'prod_name';
        this.queries = [];
        this.searchColumns = ['prod_name', 'prod_desc'];
        this.relations = '';
        this.setPage({ offset: 0 });
    }
    sort(event) {
        this.loading = true;
        this.sortBy = event.sorts[0].prop;
        this.dir = event.sorts[0].dir;
        this.setPage({ offset: 0 });
    }
    toggleExpandRow(row) {
        this.table.rowDetail.toggleExpandRow(row);
        this.cdr.detectChanges();
    }
    async detailed(row) {
        const modal = await this.modalController.create({
            component: ViewDetailedComponent,
            cssClass: 'view-order',
            componentProps: {
                product: row as ProductModel,
                edit: !this.edit
            }
        });
        await modal.present();
    }
    columnChange(index: number) {
        switch (this.queries[index].column) {
            case 'prod_id':
            case 'prod_desc':
            case 'prod_img':
            case 'prod_name': {
                this.queries[index].operators = [
                    {
                        name: 'Equals',
                        value: '='
                    },
                    {
                        name: 'Not Equal',
                        value: '!='
                    },
                    {
                        name: 'Contains',
                        value: '%'
                    },
                    {
                        name: 'Does not contain',
                        value: '!%'
                    }
                ];
                this.queries[index].operator = '%';
                this.queries[index].operatesOn = ['value', 'column'];
                this.queries[index].operateOn = 'value';
                this.queries[index].operateValue = '';
                break;
            }
            case 'prod_stock':
            case 'prod_price': {
                this.queries[index].operators = [
                    {
                        name: 'Equals',
                        value: '='
                    },
                    {
                        name: 'Not Equal',
                        value: '!='
                    },
                    {
                        name: 'Greater than',
                        value: '>'
                    },
                    {
                        name: 'Less than',
                        value: '<'
                    },
                    {
                        name: 'Greater than or equal',
                        value: '>='
                    },
                    {
                        name: 'Less than or equal',
                        value: '<='
                    },
                    {
                        name: 'Range',
                        value: '<>'
                    }
                ];
                this.queries[index].operator = '=';
                this.queries[index].operatesOn = ['value'];
                this.queries[index].operateOn = 'value';
                this.queries[index].operateValue = '';
                break;
            }
        }
    }
}
