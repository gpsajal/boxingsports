import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import {MatIconModule} from '@angular/material/icon';
import { UserRoutingModule } from './user-routing/user-routing.module';
import { UserService } from './user.service';
import { PasswordValidatorDirective } from '../directives/password-validator.directive';
@NgModule({
  declarations: [SignupComponent,
    SigninComponent,PasswordValidatorDirective],
  imports: [
    CommonModule,
    MatIconModule,
    UserRoutingModule
  ],
  providers: [UserService]
})
export class UserModule { }
