import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule }  from '@angular/router';
import { UserprofileComponent } from '../userprofile/userprofile.component';
const routes:Routes =[
  { path: 'profile', component: UserprofileComponent},
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class UserRoutingModule { }
