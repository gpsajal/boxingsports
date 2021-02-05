import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule }  from '@angular/router';
import { UserprofileComponent } from '../userprofile/userprofile.component';
import { AuthGuard } from '../../guards/index';
const routes:Routes =[
  { path: 'profile', component: UserprofileComponent,canActivate: [AuthGuard]},
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
