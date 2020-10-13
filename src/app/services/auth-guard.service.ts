import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Roles} from '../models/role-model';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
    static levels: { title: Roles, allowedLocations: string[] }[] = [
        {
            title: Roles.Empty,
            allowedLocations: []
        },
        {
            title: Roles.WarehouseClerk,
            allowedLocations: ['home', 'orders', 'shipping', 'employees', 'products', 'views']
        },
        {
            title: Roles.WareHouseManager,
            allowedLocations: ['home', 'orders', 'shipping', 'employees', 'products', 'views']
        },
        {
            title: Roles.GeneralManager,
            allowedLocations: ['home', 'orders', 'shipping', 'employees', 'products', 'views']
        },
        {
            title: Roles.ShippingManager,
            allowedLocations: ['home', 'orders', 'shipping', 'employees', 'products', 'views']
        },
        {
            title: Roles.Admin,
            allowedLocations: ['home', 'orders', 'shipping', 'employees', 'products', 'views']
        },
        {
            title: Roles.GeneralClerk,
            allowedLocations: ['home', 'orders', 'shipping', 'employees', 'products', 'views']
        },
        {
            title: Roles.DeliveryPrimary,
            allowedLocations: ['home', 'orders', 'shipping', 'employees', 'products', 'views']
        },
        {
            title: Roles.DeliveryAssistant,
            allowedLocations: ['home', 'shipping', 'views']
        },
        {
            title: Roles.CustomerService,
            allowedLocations: ['home', 'orders', 'shipping', 'employees', 'products', 'views']
        }
    ];
    constructor(private auth: AuthService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return new Observable<boolean>(observer => {
            if (this.auth.isLoggedIn()) {
                const role = this.auth.getRole();
                const allowedLocations = AuthGuardService.levels[AuthGuardService.levels.findIndex(a => a.title === role)].allowedLocations;
                let found = false;
                for (const v of allowedLocations) {
                    if (v.indexOf(route.url[0].path) > -1) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    this.auth.logout().subscribe(() => {});
                    observer.next(false);
                    observer.complete();
                    this.router.navigate(['/login']).then().catch();
                } else {
                    observer.next(true);
                    observer.complete();
                }
            } else {
                this.auth.attemptAutoAuth().then(loggedIn => {
                    observer.next(loggedIn);
                    observer.complete();
                    if (!loggedIn) {
                        this.router.navigate(['/login']).then().catch();
                    }
                });
            }
        });
    }
}
