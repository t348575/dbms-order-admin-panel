import {AddressModel} from './address-model';
import {ProductModel} from './product-model';

export type OrderModel = {
    ord_id: string,
    cust_id: string,
    ord_prod: {
        count: number,
        product: {
            prod_id: string,
            prod_price: number
        } | ProductModel
    }[],
    ord_date: string,
    ord_summ: {
        items: number[],
        total: number,
        details: {
            name: string,
            phone: string,
            address: AddressModel
        }
    },
    state: number,
    ord_payment ?: {
        name: string,
        card: string,
        cvc: string,
        exp: string
    }
};
