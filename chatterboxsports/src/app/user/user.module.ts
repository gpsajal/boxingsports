import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [SignupComponent,
    SigninComponent],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class UserModule { }
