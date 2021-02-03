import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule }        from '@angular/router';
import { LandingComponent } from '../landing/landing.component';
import { LiveplusComponent } from '../liveplus/liveplus.component';
import { TourneyComponent } from '../tourney/tourney.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { FaqComponent } from '../faq/faq.component';
const routes:Routes =[
  { path: '', component: LandingComponent},
  { path: 'liveplus', component: LiveplusComponent},
  { path: 'tourney', component: TourneyComponent},
  { path: 'schedule', component: ScheduleComponent},
  { path: 'faq', component: FaqComponent}
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class HomeRoutingModule { }
