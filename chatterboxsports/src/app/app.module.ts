import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { HomeModule }    from './home/home.module';
import { UserModule }    from './user/user.module';
import { AlertService } from './common/alertService';
import { AlertComponent } from './shared/alert/alert.component';
import { NgxStripeModule } from 'ngx-stripe';
import { httpInterceptorProviders } from './http-interceptors/index';
import { environment } from 'src/environments/environment';
@NgModule({
  declarations: [
    AppComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    HomeModule,
    UserModule,
    //NgxStripeModule.forRoot('pk_test_ahyaxlBCFVqNmlrlyMHTvUsb'),
    NgxStripeModule.forRoot(environment.stripe_publish_key),
  ],
  providers: [AlertService,httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
