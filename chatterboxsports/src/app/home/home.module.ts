import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LandingComponent } from './landing/landing.component';
import { HomeRoutingModule } from './home-routing/home-routing.module';
import { HomeService } from './home.service';
import {MatIconModule} from '@angular/material/icon';
import { LiveplusComponent } from './liveplus/liveplus.component';
import { TourneyComponent } from './tourney/tourney.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ShareddialogComponent } from './shareddialog/shareddialog.component';
import { FaqComponent } from './faq/faq.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { TermsComponent } from './terms/terms.component';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
@NgModule({
  declarations: [HeaderComponent,
    FooterComponent,
    LandingComponent,
    LiveplusComponent,
    TourneyComponent,
    ScheduleComponent,
    ShareddialogComponent,
    FaqComponent,
    TermsComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatIconModule,
    MatExpansionModule,
    MatTableModule,
    FormsModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule
  ],
  exports: [
    HeaderComponent,
    LandingComponent,
    FooterComponent,
    LiveplusComponent,
    TourneyComponent
  ],
  providers: [HomeService],
  entryComponents: [
    ShareddialogComponent
  ]
})
export class HomeModule { }
