import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { AlertService }  from '../../common/index';
@Component({
  selector: 'app-cancelsubscription',
  templateUrl: './cancelsubscription.component.html',
  styleUrls: ['./cancelsubscription.component.css']
})
export class CancelsubscriptionComponent implements OnInit {
  getloggenInUser:any ={};
  userId:any;
  userEmail:string;
  firstName:string;
  lastName:string;
  fullname:string;
  isTourneyUser:number;
  loader:boolean = false;
  constructor(public dialog: MatDialog,public dialogRef:MatDialogRef<CancelsubscriptionComponent>,private userService: UserService,private alertService:AlertService) { }

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

  closeDialog()
  {
    this.dialogRef.close();
  }

  cancelSubscription(planType)
  {
    //if(confirm("Are you sure want to cancel Live+ Subscription?")) {
    //console.log("Implement delete functionality here");
    this.loader = true;
    this.userService.deleteUserSubscription(this.userId,planType)
    .subscribe(
        data => {
            this.displayResponse(data);
        },
        error => { 
          this.displayResponse(error);
        }); 
    // }
   
  }

  /*Start- function to display alert messages */
  displayResponse(responseobject) {
     this.loader = false;
     if (responseobject.status === 400) {
      var errordata = responseobject.error.message;
     // console.log(errordata);
      this.alertService.error(errordata);
     }
     else if (responseobject.status === 409) {
       var infodata = responseobject.error.message;
       this.alertService.info(infodata);
     }
     else{
       var successdata = responseobject.message;
       this.alertService.info(successdata);
      //  localStorage.setItem('loggedInUser', JSON.stringify({ userId:this.userId,email: this.userEmail, first_name: this.firstName,last_name:this.lastName,isTourneyUser:1}));
       setTimeout(()=>{ this.dialogRef.close(); },5000);
       
       //this.gettourneystatus.emit(true);
     }
    }
    /*End- function to display alert messages */

}
