export enum Roles {
    Empty,
    DeliveryPrimary,
    DeliveryAssistant,
    WarehouseClerk,
    CustomerService,
    GeneralClerk,
    GeneralManager,
    WareHouseManager,
    ShippingManager,
    Admin
}
export const roleToName = (role: Roles) => {
    switch (role) {
        case Roles.Admin: {
            return 'Admin';
        }
        case Roles.CustomerService: {
            return 'Customer Service';
        }
        case Roles.DeliveryAssistant: {
            return 'Delivery Assistant';
        }
        case Roles.DeliveryPrimary: {
            return 'Delivery Primary';
        }
        case Roles.GeneralClerk: {
            return 'General Clerk';
        }
        case Roles.GeneralManager: {
            return 'General Manager';
        }
        case Roles.ShippingManager: {
            return 'Shipping Manager';
        }
        case Roles.WarehouseClerk: {
            return 'Warehouse Clerk';
        }
        case Roles.WareHouseManager: {
            return 'Warehouse Manager';
        }
        default: {
            return '';
        }
    }
};
export const nameToRole = (name: string) => {
    switch (name) {
        case 'Admin': {
            return Roles.Admin;
        }
        case 'Customer Service': {
            return Roles.CustomerService;
        }
        case 'Delivery Assistant': {
            return Roles.DeliveryAssistant;
        }
        case 'Delivery Primary': {
            return Roles.DeliveryPrimary;
        }
        case 'General Clerk': {
            return Roles.GeneralClerk;
        }
        case 'General Manager': {
            return Roles.GeneralManager;
        }
        case 'Shipping Manager': {
            return Roles.ShippingManager;
        }
        case 'Warehouse Clerk': {
            return Roles.WarehouseClerk;
        }
        case 'Warehouse Manager': {
            return Roles.WareHouseManager;
        }
        default: {
            return Roles.Empty;
        }
    }
};
