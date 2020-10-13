import { Injectable } from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    static toaster: ToastController;
    constructor(private toastController: ToastController) { ToastService.toaster = this.toastController; }
    static toast(message: string, duration = 3000, color = 'medium', position: 'top' | 'bottom' | 'middle' = 'top') {
        ToastService.toaster.create({
            message,
            duration,
            color,
            position
        }).then(a => a.present());
    }
}
