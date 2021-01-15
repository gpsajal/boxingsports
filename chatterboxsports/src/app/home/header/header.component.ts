import { Component, OnInit } from '@angular/core';
import { SigninComponent } from '../../user/signin/signin.component';
import {MatDialog} from '@angular/material/dialog';

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
 
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    if(localStorage.getItem('loggedInUser')) {
      this.getloggenInUser=  JSON.parse(localStorage.getItem('loggedInUser'));
      this.firstName = this.getloggenInUser.first_name;
      this.lastName = this.getloggenInUser.last_name;
      this.userEmail = this.getloggenInUser.email;
      console.log(this.getloggenInUser);
    }
  }

  openSigninDialog()
  {
    const dialogRef = this.dialog.open(SigninComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:'+result);
    });
  }

}
