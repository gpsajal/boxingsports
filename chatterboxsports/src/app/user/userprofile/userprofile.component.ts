import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CancelsubscriptionComponent } from '../../user/cancelsubscription/cancelsubscription.component';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  getloggenInUser:any ={};
  userId:number;
  userEmail:string;
  firstName:string;
  lastName:string;
  fullname:string;
  isTourneyUser:number;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    if(localStorage.getItem('loggedInUser')) {
      this.getloggenInUser=  JSON.parse(localStorage.getItem('loggedInUser'));
      this.userId = this.getloggenInUser.userId;
      this.firstName = this.getloggenInUser.first_name;
      this.lastName = this.getloggenInUser.last_name;
      this.userEmail = this.getloggenInUser.email;
      this.fullname = this.firstName+' '+this.lastName;
      this.isTourneyUser = this.getloggenInUser.isTourneyUser;
    }
  }

  

   opencancelDialog()
  {
    const dialogRef = this.dialog.open(CancelsubscriptionComponent);
  
  }

   

}
