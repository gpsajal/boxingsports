import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LandingComponent } from './landing/landing.component';
import { HomeRoutingModule } from './home-routing/home-routing.module';
import { HomeService } from './home.service';
import {MatIconModule} from '@angular/material/icon';
@NgModule({
  declarations: [HeaderComponent,
    FooterComponent,
    LandingComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,MatIconModule
  ],
  exports: [
    HeaderComponent,
    LandingComponent,
    FooterComponent,
  ],
  providers: [HomeService]
})
export class HomeModule { }
