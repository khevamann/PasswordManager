import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPassPageRoutingModule } from './add-pass-routing.module';

import { AddPassPage } from './add-pass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPassPageRoutingModule,
  ],
  declarations: [AddPassPage]
})
export class AddPassPageModule {}
