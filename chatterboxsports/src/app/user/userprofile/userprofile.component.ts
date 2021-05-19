import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CancelsubscriptionComponent } from '../../user/cancelsubscription/cancelsubscription.component';
import * as moment from 'moment'
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  getloggenInUser:any ={};
  userId:any;
  userEmail:string;
  firstName:string;
  lastName:string;
  fullname:string;
  isTourneyUser:number;
  isLivePlusUser:number;
  isLivePlusUserCancelled:boolean = false;
  subscriptionData = [];
  liveplusExpireDate:any;
  tourneyExpireDate:any;
  liveproductPrice:any;
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
      this.isLivePlusUser = this.getloggenInUser.isLivePlusUser;
      this.subscriptionData = this.getloggenInUser.subscriptions;

      if(this.subscriptionData.length > 0)
      {
       
        for(var i = 0; i < this.subscriptionData.length; i++)
        {
          if(this.subscriptionData[i].planType == 'live+')
          {
            this.liveplusExpireDate = moment.unix(this.subscriptionData[i].expiryDate).format(environment.DATE_FORMAT);
            this.liveproductPrice = this.subscriptionData[i].productPrice;
          }
          
          // if(this.subscriptionData[i].planType == 'tourney')
          // {
          //   this.tourneyExpireDate = this.subscriptionData[1].expiryDate;
          // }
        }
       
      }
    }
  }

  
/*function for open cancel payment*/
   opencancelDialog()
  {
    const dialogRef = this.dialog.open(CancelsubscriptionComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.isLivePlusUserCancelled = true;
      }
    });
  }
  /*function for open cancel payment*/

   

}
