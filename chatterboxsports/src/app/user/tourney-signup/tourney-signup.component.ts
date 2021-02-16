import { Component, OnInit, ViewChild, Inject,Output,EventEmitter } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { environment } from '../../../environments/environment';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { AlertService, AuthenticationService }  from '../../common/index';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import * as moment from 'moment'

@Component({
  selector: 'app-tourney-signup',
  templateUrl: './tourney-signup.component.html',
  styleUrls: ['./tourney-signup.component.css']
})
export class TourneySignupComponent implements OnInit {
  @Output() gettourneystatus: EventEmitter<any> = new EventEmitter();
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };
 
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };
  model: any = {};
  isFormValid: boolean = null;
  loader:boolean = false;
  singupButtonCaption:string = 'Complete Purchase';
  isSignupPaymentStatus:boolean = false;
  successMsg:string;
  subcriptionValidityDate:string;
  isTourneyUser:boolean = false;
  getloggenInUser:any ={};
  userId:any;
  userEmail:string;
  firstName:string;
  lastName:string;
  fullname:string;
  token:string;
  subscriptions = [];
  isLivePlusUser:number;
  isUserLoggedIn:boolean = false;
  tourneyData:any = {};
  subscriptionObject:any = {};
  constructor(private userService: UserService,public dialog: MatDialog, private alertService:AlertService,private stripeService: StripeService,@Inject(MAT_DIALOG_DATA) public shareddata: any,private authenticationService: AuthenticationService,public dialogRef:MatDialogRef<TourneySignupComponent>) 
  { 
    authenticationService.getLoggedInUserName.subscribe( isUserLoggedIn => this.checkUsersession(isUserLoggedIn)); 
  }

  ngOnInit(): void {

    if(localStorage.getItem('loggedInUser')) {
      this.getloggenInUser=  JSON.parse(localStorage.getItem('loggedInUser'));
      this.userId = this.getloggenInUser.userId;
      this.firstName = this.getloggenInUser.first_name;
      this.lastName = this.getloggenInUser.last_name;
      this.userEmail = this.getloggenInUser.email;
      this.fullname = this.firstName+' '+this.lastName;
      this.isUserLoggedIn = true;
      this.token = this.getloggenInUser.token;
      this.isLivePlusUser = this.getloggenInUser.isLivePlusUser;
      this.subscriptions = this.getloggenInUser.subscriptions;
      this.isTourneyUser = this.getloggenInUser.isTourneyUser;
     
      //this.isTourneyUser = this.
    }
    if(this.shareddata.isTourneyUser != undefined && this.shareddata.isTourneyUser != '')
    {
      this.isTourneyUser = this.shareddata.isTourneyUser;
    }
    //this.subcriptionValidityDate = moment().add(1, 'month').format('MMMM Do YYYY');
    //this.createForm();
  }

  /*start custom validator for check whitespace in user input*/ 
  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }
  /*end custom validator for check whitespace in user input*/ 

  private checkUsersession(isuserLoggedIn: boolean): void {
    this.isUserLoggedIn = isuserLoggedIn;
  }


  /*start- user signup function */
  // submitSignupForm() {
  //   this.loader = true;
  //   this.singupButtonCaption = 'Please wait...';
  //     this.isFormValid = true;	
  //     //this.signupform.value.stripeToken = 'pm_1I8qqtGV54ADk0vh6NPjo9ts';
  //     var name = this.firstName +' '+this.lastName;
  //     this.stripeService
  //     .createToken(this.card.element, { name })
  // //     this.stripeService.createPaymentMethod ({
  // //   type: 'card',
  // //   card: this.card.element,
  // //   billing_details: {
  // //     name: name,
  // //     email:this.userEmail
  // //   },
  // // })
  // .subscribe((result) => {
  //  // console.log(result);
  //       if (result.token != undefined) {
  //         // Use the token
  //        this.tourneyData.payToken = result.token.id;
  //        this.tourneyData.userId = this.userId;
  //        // console.log( result.paymentMethod.id);
  //         this.saveUser();
  //       } else if (result.error) {
  //         // Error creating the token
  //         this.isFormValid = false;
  //         this.loader = false;
  //         this.alertService.error(result.error.message);
  //         this.singupButtonCaption = 'Complete Purchase';
  //         //console.log(result.error.message);
  //       }
  //     });
     
  // }
  // /*end- user signup function */


  getTourneyStripeSecret() 
  {
     this.loader = true;
        var name = this.firstName +' '+this.lastName;
        this.stripeService.createPaymentMethod ({
          type: 'card',
          card: this.card.element,
          billing_details: {
            name: name,
            email:this.userEmail
          },
        }).subscribe((result) => {
        
            if (result.paymentMethod != undefined)
            {
              this.subscriptionObject.email = this.userEmail;
              this.subscriptionObject.priceId = environment.tourneyPriceId;
              this.subscriptionObject.method = result.paymentMethod.id;
              this.subscriptionObject.isTourney = true;
              //console.log(this.subscriptionObject);
              this.userService.getStripeBuySubscription(this.subscriptionObject)
              .subscribe(
              data => 
              {
                  // Use the token
                  //console.log(data);                  
                  const client_secret = data.data.clientSecret;
                  const status = data.data.status;
                  const subscriptionId = data.data.subscriptionId;
            
                  if(status == 'succeeded')
                  {
                    this.saveUser(subscriptionId);
                  }
                  else
                  {
                     // Error creating the token
                      this.isFormValid = false;
                      this.loader = false;
                      this.alertService.error('Payment Failed');
                      this.singupButtonCaption = 'Complete Purchase';
                  }
              },
              error=>
              {
                  // Error creating the token
                  this.isFormValid = false;
                  this.loader = false;
                  this.alertService.error(error.message);
                  this.singupButtonCaption = 'Complete Purchase';
              });
            }
            else if(result.error != undefined)
            {
              this.isFormValid = false;
              this.loader = false;
              this.alertService.error(result.error.message);
              this.singupButtonCaption = 'Complete Purchase';
            }
        });
  }
  /*End- function for create stripe token*/
    

    /*Start- function to display alert messages */
  displayResponse(responseobject) {
   // console.log(responseobject);
    this.loader = false;
    this.singupButtonCaption = 'Complete Purchase';
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
      this.isSignupPaymentStatus = true;
      //this.alertService.success(successdata);
      this.successMsg = successdata;
      
      localStorage.setItem('loggedInUser', JSON.stringify({ userId:this.userId,email: this.userEmail, first_name: this.firstName,last_name:this.lastName,isTourneyUser:1,token:this.token,subscriptions:this.subscriptions,isLivePlusUser:this.isLivePlusUser}));
      //console.log(localStorage.getItem('loggedInUser'));
      setTimeout(()=>{ this.dialogRef.close(1); },5000);
      
      //this.gettourneystatus.emit(true);
    }
   }
   /*End- function to display alert messages */

   closeDialog()
   {
     this.dialogRef.close();
   }

   /*Start- function for create stripe token*/
   saveUser(subscriptionId) {
    this.tourneyData = {
      productId: 'stripe',
      platform: 'web',
      productPrice: "14.99",
      planType: 'tourney',
      planName: 'Tourney',
      planDescription: 'Tourney plan description',
      expiryDate: "1629844921000",
      receiptData: subscriptionId
    };
    this.userService.userTourneySignup(this.tourneyData,this.userId)
    .subscribe(
        data => {
            this.displayResponse(data);
        },
        error => { 
          this.isFormValid = false;
          this.displayResponse(error);
        }); 
    }
   /*End- function for create stripe token*/

}
