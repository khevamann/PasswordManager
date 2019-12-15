import {Component} from '@angular/core';
import {DataProvider, Password} from '../data-service.service';
import {AlertController, ModalController} from '@ionic/angular';

@Component({
  selector: 'app-add-pass',
  templateUrl: './add-pass.page.html',
  styleUrls: ['./add-pass.page.scss'],
})
export class AddPassPage {
  pass: Password = {name: '', email: '', pass: '', notes: '', tags: []};
  index = -1;

  constructor(private data: DataProvider,
              private modalCtrl: ModalController,
              private alertController: AlertController) {
  }

  editTags(data) {
    this.pass.tags = data.split(' ');
  }

  addItem() {
    if (this.index === -1) {
      this.pass.tags.push('all');
      this.data.addPassword(this.pass);
    } else {
      this.data.save();
    }
    this.close();
  }

  close() {
    this.pass = {name: '', email: '', pass: '', notes: '', tags: []};
    this.modalCtrl.dismiss();
  }

  async deletePass() {
    const alert = await this.alertController.create({
      message: 'Are you sure you want to delete this password?',
      translucent: true,
      buttons: [
        {
          text: 'Delete',
          role: 'danger',
          handler: () => {
            this.data.removePassword(this.index);
            this.close();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
      ]
    });
    await alert.present();
  }

}