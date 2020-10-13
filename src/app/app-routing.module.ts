import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuardService} from './services/auth-guard.service';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
    },
    {
        path: 'home',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
    },
    {
        path: 'orders',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./orders/orders.module').then( m => m.OrdersPageModule)
    },
    {
        path: 'shipping',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./shipping/shipping.module').then( m => m.ShippingPageModule)
    },
    {
        path: 'employees',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./employees/employees.module').then( m => m.EmployeesPageModule)
    },
    {
        path: 'products',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./products/products.module').then( m => m.ProductsPageModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
