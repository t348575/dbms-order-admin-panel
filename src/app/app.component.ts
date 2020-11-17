import {ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {MenuController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {AuthService} from './services/auth.service';
import {Roles, roleToName} from './models/role-model';
import {ToastService} from './services/toast.service';
import {AuthGuardService} from './services/auth-guard.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    public selectedIndex = 0;
    public appPages: { title: string, url: string, icon: string, visible: boolean }[] = [
        {
            title: 'Home',
            url: '/home',
            icon: 'home',
            visible: true
        },
        {
            title: 'Orders',
            url: '/orders',
            icon: 'list',
            visible: true
        },
        {
            title: 'Shipping',
            url: '/shipping',
            icon: 'airplane',
            visible: true
        },
        {
            title: 'Products',
            url: '/products',
            icon: 'cart',
            visible: true
        },
        {
            title: 'Employees',
            url: '/employee',
            icon: 'people-circle',
            visible: true
        }
    ];
    public role = '';
    viewAccess = false;
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private menuCtrl: MenuController,
        private router: Router,
        public auth: AuthService,
        private toast: ToastService,
        private cdr: ChangeDetectorRef
    ) {
        this.initializeApp();
        this.auth.attemptAutoAuth().then((status) => {
            if (status) {
                this.initStuff();
            }
        });
        this.auth.authObservable.subscribe(() => {
            this.initStuff();
        });
    }
    initStuff() {
        this.role = roleToName(this.auth.getRole());
        const role = this.auth.getRole();
        const allowed = AuthGuardService.levels[AuthGuardService.levels.findIndex(a => a.title === role)].allowedLocations;
        for (const v of this.appPages) {
            if (allowed.indexOf(v.url.slice(1)) === -1) {
                v.visible = false;
            }
        }
        this.viewAccess =
            AuthGuardService.levels[AuthGuardService.levels.findIndex(a => a.title === role)].allowedLocations.indexOf('views') !== -1;
        this.cdr.detectChanges();
    }
    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    ngOnInit() {
        this.router.events.subscribe((event: RouterEvent) => {
            if (event instanceof NavigationEnd && event.url === '/login') {
                this.menuCtrl.enable(false);
            }
        });
        const path = window.location.pathname.split('/')[1];
        if (path !== undefined) {
            this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
        }
    }
    logout() {
        this.auth.logout().subscribe(() => {
            ToastService.toast('Logout successful!', 3000, 'success');
        }, () => {
            ToastService.toast('Logout not successful!', 3000, 'danger');
        });
    }
}
