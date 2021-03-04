import { Component, OnInit } from '@angular/core';
import { SigninComponent } from '../../user/signin/signin.component';

import {MatDialog} from '@angular/material/dialog';
import { AlertService, AuthenticationService }  from '../../common/index';
import { Router, NavigationStart } from '@angular/router';
import { SignupComponent } from '../../user/signup/signup.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  getloggenInUser:any ={};
  userEmail:string;
  firstName:string;
  lastName:string;
  fullname:string;
  isCheckTourneyUser:boolean = false;
  isTourneyUser:number;
  isUserLoggedIn:boolean = false;
  statusCode:any;
 
  constructor(public dialog: MatDialog,private alertService:AlertService,private router: Router,private authenticationService: AuthenticationService) { 
    authenticationService.getLoggedInUserName.subscribe( isUserLoggedIn => this.checkUsersession(isUserLoggedIn));
    authenticationService.checktourneyUser.subscribe( isCheckTourneyUser => this.checkUserPlan(isCheckTourneyUser));
    authenticationService.getUserfullname.subscribe( userfullname => this.getUserFullName(userfullname));
  }

  ngOnInit(): void {
    if(localStorage.getItem('loggedInUser')) {
      this.getloggenInUser=  JSON.parse(localStorage.getItem('loggedInUser'));
      this.firstName = this.getloggenInUser.first_name;
      this.lastName = this.getloggenInUser.last_name;
      this.userEmail = this.getloggenInUser.email;
      this.fullname = this.firstName+' '+this.lastName;
      this.isTourneyUser = this.getloggenInUser.isTourneyUser;
    }
    //this.openSignupDialog();
  }

  private checkUsersession(isuserLoggedIn: boolean): void {
    this.isUserLoggedIn = isuserLoggedIn;
  }
  private getUserFullName(fullname: string): void {
    this.fullname = fullname;
  }
  private checkUserPlan(isCheckTourneyUser: boolean): void {
    if(isCheckTourneyUser)
    {
      this.isTourneyUser = 1;
    }
  }

  openSigninDialog()
  {
    const dialogRef = this.dialog.open(SigninComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined && result != '')
      {
        this.fullname = result;
      }
    });
  }

  openSignupDialog()
  {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(SignupComponent);
    //const dialogRef = this.dialog.open(SignupComponent,{disableClose:true});

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  

  userLogout()
  {
    // this.fullname = '';
    // localStorage.removeItem('loggedInUser');
    // this.alertService.success('User Logout Successfully');
    // setTimeout(()=>{ 
    //   this.router.navigate(['/']);
    //    },2000);
    // setTimeout(()=>{ 
    //   window.location.reload(); },4000);
    this.authenticationService.logout(this.statusCode).subscribe(
      data => {
        this.fullname = '';
      },
      error => {
       
      });
    
  }

  scrollToSection()
  {
    let element:HTMLDivElement  = document.getElementById('faq') as HTMLDivElement;
    element.scrollIntoView({
        behavior: "smooth", block: "start"
    });
  }

}
