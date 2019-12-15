import {Component} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {AddPassPage} from '../add-pass/add-pass.page';
import {DataProvider} from '../data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private modalController: ModalController, public data: DataProvider, private toastCtrl: ToastController) {
  }

  search(event) {
    const value = event.target.value.toLowerCase().trim();
    this.data.filterPass(value);
  }

  async addPass() {
    const modal = await this.modalController.create({
      component: AddPassPage
    });
    return await modal.present();
  }

  async editPass(pass, index) {
    const modal = await this.modalController.create({
      component: AddPassPage,
      componentProps: {
        pass,
        index
      }
    });
    return await modal.present();
  }

  async copyInputMessage(inputElement) {
    const inputEl = inputElement.el.getElementsByTagName('input')[0];
    inputEl.select();
    document.execCommand('copy');
    inputEl.setSelectionRange(0, 0);
    const toast = await this.toastCtrl.create({
      message: 'Your password has been copied!',
      duration: 1000
    });
    await toast.present();
  }
}
