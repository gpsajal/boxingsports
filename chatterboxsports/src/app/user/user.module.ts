import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import {MatIconModule} from '@angular/material/icon';
import { UserRoutingModule } from './user-routing/user-routing.module';
import { UserService } from './user.service';
import { PasswordValidatorDirective } from '../directives/password-validator.directive';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { AlertService, AuthenticationService }  from '../common/index';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxStripeModule } from 'ngx-stripe';
import { TourneySignupComponent } from './tourney-signup/tourney-signup.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { CancelsubscriptionComponent } from './cancelsubscription/cancelsubscription.component';
import { AuthGuard } from '../guards/index';
import { environment } from 'src/environments/environment';
@NgModule({
  declarations: [SignupComponent,
    SigninComponent,PasswordValidatorDirective, TourneySignupComponent, UserprofileComponent, CancelsubscriptionComponent],
  imports: [
    CommonModule,
    MatIconModule,
    UserRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    //NgxStripeModule.forRoot('pk_test_ahyaxlBCFVqNmlrlyMHTvUsb'),
    NgxStripeModule.forRoot(environment.stripe_publish_key),
  ],
  providers: [UserService, AuthenticationService,AuthGuard]
})
export class UserModule { }
