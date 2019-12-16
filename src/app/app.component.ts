import {Component, ElementRef, ViewChild} from '@angular/core';

import {AlertController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {DataProvider} from './data-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  // @ts-ignore
  @ViewChild('inputFile') myDiv: ElementRef<HTMLElement>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public data: DataProvider,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.data.loadUser();
    this.router.navigateByUrl('login');
  }

  async openSettings() {
    const alert = await this.alertCtrl.create({
      message: 'Load or save passwords...',
      translucent: true,
      buttons: [
        {
          text: 'Load',
          handler: () => {
            const el: HTMLElement = this.myDiv.nativeElement;
            el.click();
          },
        },
        {
          text: 'Save',
          handler: () => {
            this.data.savePasswordFile();
          },
        },
      ]
    });
    await alert.present();
  }

  fileChanged(event) {
    const file = event.target.files[0];
    this.data.loadPasswordFile(file);
  }
}
