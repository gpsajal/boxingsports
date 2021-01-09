import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeModule }    from './home/home.module';
import { UserModule } from './user/user.module';
import { PagenotfoundComponent } from './shared/pagenotfound/pagenotfound.component';
const routes: Routes = [ 
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [CommonModule,HomeModule,
    UserModule,RouterModule.forRoot(routes,{preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
