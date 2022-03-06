import {Component, OnInit} from '@angular/core';
import {DataProvider} from '../data-service.service';
import {Router} from '@angular/router';
import {MenuController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  pass = '';
  error = '';

  constructor(public data: DataProvider,
              public router: Router,
              private menuCtrl: MenuController) {
  }

  ngOnInit() {
    this.menuCtrl.enable(false);
  }

  async loginUser() {
    const isCorrect = await this.data.isCorrectPassword(this.pass);
    if (this.data.existingUser) {
      if (isCorrect) {
        this.data.setLogin(this.pass);
        this.data.loadPasswords();
        this.router.navigateByUrl('/home', {replaceUrl: true});
      } else {
        this.error = 'Incorrect Password!';
      }
    } else {
      this.data.setLogin(this.pass);
      this.data.loadPasswords();
      this.router.navigateByUrl('/home', {replaceUrl: true});
    }
  }
}
