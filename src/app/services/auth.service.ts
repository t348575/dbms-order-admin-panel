import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../../constants';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {nameToRole, Roles} from '../models/role-model';
import {MenuController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loggedIn = false;
    private role: Roles = Roles.Empty;
    authObservable: Subject<void> = new Subject<void>();
    constructor(private http: HttpClient, private router: Router, private menuCtrl: MenuController) {
    }
    attemptAutoAuth() {
        return new Promise<boolean>(resolve => {
            if (localStorage.getItem('loginToken')) {
                this.http.post(`${Constants.server}/users/autoLogin`, {
                    loginToken: localStorage.getItem('loginToken'),
                    apiToken: localStorage.getItem('apiToken')
                }).subscribe((data: { status: boolean, loginToken: string, apiToken: string, role: string }) => {
                    localStorage.setItem('loginToken', data.loginToken);
                    localStorage.setItem('apiToken', data.apiToken);
                    this.role = nameToRole(data.role);
                    if (data.status) {
                        this.loggedIn = true;
                    }
                    resolve(this.loggedIn);
                }, (err) => {
                    resolve(false);
                });
            } else {
                resolve(false);
            }
        });
    }
    login(username: string, password: string): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this.http.post(`${Constants.server}/users/login`, {
                username,
                password
            }).subscribe((data: { status: boolean, loginToken: string, apiToken: string, role: string }) => {
                observer.next(data.status);
                observer.complete();
                localStorage.setItem('loginToken', data.loginToken);
                localStorage.setItem('apiToken', data.apiToken);
                this.role = nameToRole(data.role);
                if (data.status) {
                    this.authObservable.next();
                    this.loggedIn = true;
                    this.menuCtrl.enable(true);
                }
            }, (err) => {
                observer.next(false);
                observer.complete();
            });
        });
    }
    logout(): Observable<{status: boolean, message: string}> {
        return new Observable<{status: boolean, message: string}>(observer => {
            this.http.post(`${Constants.server}/users/logout`, {
                loginToken: localStorage.getItem('loginToken'),
                apiToken: localStorage.getItem('apiToken')
            }).subscribe((data: {status: boolean, message: string}) => {
                observer.next(data);
                observer.complete();
                if (data.status) {
                    this.loggedIn = false;
                    this.role = Roles.Empty;
                }
                localStorage.setItem('loginToken', '');
                localStorage.setItem('apiToken', '');
                this.role = Roles.Empty;
                this.router.navigate(['/login']).then().catch();
            }, error => {
                observer.next({status: false, message: error});
                observer.complete();
            });
        });
    }
    isLoggedIn(): boolean {
        return this.loggedIn;
    }
    getToken(): string {
        return localStorage.getItem('apiToken');
    }
    getLoginToken(): string {
        return localStorage.getItem('loginToken');
    }
    getRole() {
        return this.role;
    }
}
