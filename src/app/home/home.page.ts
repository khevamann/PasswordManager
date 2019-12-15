import {Component} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {AddPassPage} from '../add-pass/add-pass.page';
import {DataProvider, Password} from '../data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  passwords: Array<Password>;

  constructor(private modalController: ModalController, private data: DataProvider, private toastCtrl: ToastController) {
    this.getPasswords();
  }

  async getPasswords() {
    this.passwords = await this.data.loadPasswords();
  }
  search(event) {
    const value = event.target.value.toLowerCase().trim();
    this.passwords = this.data.currPasswords.filter(
      (pass) => {
        const name = pass.name.toLowerCase();
        return name.includes(value);
      });
  }

  clearSearch() {
    this.passwords = this.data.currPasswords;
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
