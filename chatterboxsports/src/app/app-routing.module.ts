import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeModule }    from './home/home.module';
import { UserModule } from './user/user.module';
const routes: Routes = [ 
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [HomeModule,
    UserModule,RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
