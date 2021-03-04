import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { AlertService }  from '../../common/index';
import * as moment from 'moment'
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
  isLivePlusUser:number;
  subscriptionData = [];
  token:string;
  liveplusExpireDate:any;
  constructor(public dialog: MatDialog,public dialogRef:MatDialogRef<CancelsubscriptionComponent>,private userService: UserService,private alertService:AlertService) { }

  ngOnInit(): void {
    if(localStorage.getItem('loggedInUser')) {
      this.getloggenInUser=  JSON.parse(localStorage.getItem('loggedInUser'));
      this.userId = this.getloggenInUser.userId;
      this.firstName = this.getloggenInUser.first_name;
      this.lastName = this.getloggenInUser.last_name;
      this.userEmail = this.getloggenInUser.email;
      this.fullname = this.firstName+' '+this.lastName;
      this.token = this.getloggenInUser.token;
      this.isTourneyUser = this.getloggenInUser.isTourneyUser;
      this.isLivePlusUser = this.getloggenInUser.isLivePlusUser;
      this.subscriptionData = this.getloggenInUser.subscriptions;

      this.subscriptionData = this.getloggenInUser.subscriptions;

      if(this.subscriptionData.length > 0)
      {
       
        for(var i = 0; i < this.subscriptionData.length; i++)
        {
          if(this.subscriptionData[i].planType == 'live+')
          {
            this.liveplusExpireDate = moment(this.subscriptionData[i].expiryDate).format(environment.DATE_FORMAT);
          }
          
          // if(this.subscriptionData[i].planType == 'tourney')
          // {
          //   this.tourneyExpireDate = this.subscriptionData[1].expiryDate;
          // }
        }
       
      }
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
            this.displayResponse(data,planType);
        },
        error => { 
          this.displayResponse(error,planType);
        }); 
    // }
   
  }

  /*Start- function to display alert messages */
  displayResponse(responseobject,planType) {
     this.loader = false;
     if (responseobject.status === 400) {
      var errordata = responseobject.error.message;
      this.alertService.error(errordata);
     }
     else if (responseobject.status === 409) {
       var infodata = responseobject.error.message;
       this.alertService.info(infodata);
     }
     else{
       var successdata = responseobject.message;
       this.alertService.success(successdata);
       if(planType == 'live+')
       {
        localStorage.setItem('loggedInUser', JSON.stringify({ userId:this.userId,email: this.userEmail, first_name: this.firstName,last_name:this.lastName,isTourneyUser:this.isTourneyUser,token:this.token,subscriptions:this.subscriptionData,isLivePlusUser:0}));
       }
       else if(planType == '')
       {

       }
      //  localStorage.setItem('loggedInUser', JSON.stringify({ userId:this.userId,email: this.userEmail, first_name: this.firstName,last_name:this.lastName,isTourneyUser:1}));
       setTimeout(()=>{ this.dialogRef.close(true); },5000);
       
       //this.gettourneystatus.emit(true);
     }
    }
    /*End- function to display alert messages */

}
