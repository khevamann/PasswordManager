import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPassPage } from './add-pass.page';

const routes: Routes = [
  {
    path: '/addPass',
    component: AddPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPassPageRoutingModule {}
