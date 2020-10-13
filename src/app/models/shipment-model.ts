export type ShipmentModel = {
    ship_id: string,
    cust_id: string,
    ord_id: string,
    emp_id: string,
    ship_status: {
        time: string,
        value: string
    }[],
    ship_est_date: string,
    ship_bill: {
        items: {
            count: number,
            prod_name: string,
            prod_price: number
        }[],
        total: number,
        payment: {
            card: string,
            name: string,
        }
        ord_date: string
    }[],
    ord_date: string,
    state: number,
    emp_phone: string,
    emp_email: string
};
