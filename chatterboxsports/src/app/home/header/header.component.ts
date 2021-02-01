import { Component, OnInit } from '@angular/core';
import { SigninComponent } from '../../user/signin/signin.component';
import {MatDialog} from '@angular/material/dialog';
import { AlertService, AuthenticationService }  from '../../common/index';

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
  isTourneyUser:boolean = false;
 
  constructor(public dialog: MatDialog,private alertService:AlertService) { }

  ngOnInit(): void {
    if(localStorage.getItem('loggedInUser')) {
      this.getloggenInUser=  JSON.parse(localStorage.getItem('loggedInUser'));
      this.firstName = this.getloggenInUser.first_name;
      this.lastName = this.getloggenInUser.last_name;
      this.userEmail = this.getloggenInUser.email;
      //console.log(this.getloggenInUser);
      this.fullname = this.firstName+' '+this.lastName;
      this.isTourneyUser = this.getloggenInUser.isTourneyUser;
    }
  }

  openSigninDialog()
  {
    const dialogRef = this.dialog.open(SigninComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log('Dialog result:'+result);
      if(result != undefined && result != '')
      {
        this.fullname = result;
      }
    });
  }

  userLogout()
  {
    this.fullname = '';
    localStorage.removeItem('loggedInUser');
    this.alertService.success('User Logout Successfully');
    setTimeout(()=>{ window.location.reload(); },4000);
    
  }

}
