import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { environment } from '../../../environments/environment';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { AlertService }  from '../../common/index';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import * as moment from 'moment'
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
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
  signupform: FormGroup;
  first_name: FormControl;
  last_name: FormControl;
  email_address: FormControl;
  confirm_email_address: FormControl;
  password: FormControl;
  confirm_password: FormControl;
  terms: FormControl;
  isFormValid: boolean = null;
  loader:boolean = false;
  singupButtonCaption:string = 'Complete Purchase';
  isSignupPaymentStatus:boolean = false;
  successMsg:string;
  subcriptionValidityDate:string;
  isTourneyUser:boolean = false;
  constructor(private userService: UserService,public dialog: MatDialog, private alertService:AlertService,private stripeService: StripeService,@Inject(MAT_DIALOG_DATA) public shareddata: any,private router: Router,public dialogRef:MatDialogRef<SignupComponent>) { }

  ngOnInit(): void {
    if(this.shareddata != undefined)
    {
      if(this.shareddata.isTourneyUser != undefined && this.shareddata.isTourneyUser != '')
      {
        this.isTourneyUser = this.shareddata.isTourneyUser;
      }
    }
   
    this.subcriptionValidityDate = moment().add(1, 'month').format('MMMM Do YYYY');
    this.createForm();
  }

  /*start custom validator for check whitespace in user input*/ 
  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }
  /*end custom validator for check whitespace in user input*/ 

  /* start- function for create form*/
  createForm() {
    this.first_name = new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      this.noWhitespaceValidator
    ]);
    this.last_name = new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      this.noWhitespaceValidator
    ]);
    this.email_address = new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z][A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-z]{2,4}$/)
    ]);
    this.confirm_email_address = new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z][A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-z]{2,4}$/)
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      //Validators.maxLength(10),
      Validators.pattern(/^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)$/)
    ]);
    this.confirm_password = new FormControl('', [
      Validators.required
    ]);
    this.terms = new FormControl('',Validators.required);
    this.signupform = new FormGroup({
      first_name: this.first_name,
      last_name: this.last_name,
      email_address: this.email_address,
      confirm_email_address: this.confirm_email_address,
      password: this.password,
      confirm_password: this.confirm_password,
      terms: this.terms,
    });
  }
  /* end- function for create form*/

  
  /*start- user signup function */
  submitSignupForm() {
    this.isFormValid = false;
	  if(this.signupform.invalid){
		  return;	
    }
    
    this.loader = true;
    this.singupButtonCaption = 'Please wait...';
    delete this.signupform.value.terms;
      this.isFormValid = true;	
      //this.signupform.value.stripeToken = 'pm_1I8qqtGV54ADk0vh6NPjo9ts';
      var name = this.signupform.value.first_name+' '+this.signupform.value.last_name;
      this.stripeService
      //.createToken(this.card.element, { name })
      .createPaymentMethod ({
    type: 'card',
    card: this.card.element,
    billing_details: {
      name: name,
      email:this.signupform.value.email_address
    },
  }).subscribe((result) => {
        if (result.paymentMethod != undefined) {
          // Use the token
          this.signupform.value.stripeToken = result.paymentMethod.id;
         // console.log( result.paymentMethod.id);
          this.saveUser();
        } else if (result.error) {
          // Error creating the token
          this.isFormValid = false;
          this.loader = false;
          this.alertService.error(result.error.message);
          this.singupButtonCaption = 'Complete Purchase';
          //console.log(result.error.message);
        }
      });
     
  }
  /*end- user signup function */

    /*start- signup form validations messages*/
    showErrors(errortype:string) {
     
      if(errortype == 'first_name')
      {
        return  this.first_name.hasError('required') ? 'This Field is required.' : 
                this.first_name.hasError('maxlength') ? 'Maximun 50 characters allowed.' :
                this.first_name.hasError('whitespace') ? 'Please enter valid data.' :
                '';
                
      }
      else if(errortype == 'last_name')
      {
        return  this.last_name.hasError('required') ? 'This Field is required.' : 
                this.last_name.hasError('maxlength') ? 'Maximun 50 characters allowed.' :
                this.last_name.hasError('whitespace') ? 'Please enter valid data.' :
                '';
                
      }
      else if(errortype == 'email_address')
      {
        return  this.email_address.hasError('required') ? 'This Field is required.' :
                this.email_address.hasError('email') ? 'Please enter valid email.' :
                this.email_address.hasError('pattern') ? 'Please enter valid email.' :
                '';
  
      }
      else if(errortype == 'confirm_email_address')
      {
        return  this.confirm_email_address.hasError('required') ? 'This Field is required.' :
                this.confirm_email_address.hasError('email') ? 'Please enter valid email.' :
                this.confirm_email_address.hasError('pattern') ? 'Please enter valid email.' :
                '';
  
      }
      else if(errortype == 'password')
      {
        return  this.password.hasError('required') ? 'This Field is required.' :
                this.password.hasError('minlength') ? 'Password must contain at least 4 characters.' :
                //this.password.hasError('maxlength') ? 'Your password should not be greater than 10 characters.' :
                this.password.hasError('pattern') ? 'Password must contain one uppercase and number.' :
                '';
      }
      else if(errortype == 'confirm_password')
      {
        return  this.confirm_password.hasError('required') ? 'This Field is required.' :
        this.confirm_password.hasError('confirmpassword') ? 'Password does not match.' :
                '';
      }
      else if(errortype == 'terms')
      {
        return  this.terms.hasError('required') ? 'This Field is required.' :
                '';
      }         
    }
    /*end- signup form validations messages*/

    /*Start- function to display alert messages */
  displayResponse(responseobject) {
    console.log(responseobject);
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
    }
   }
   /*End- function to display alert messages */

   closeDialog()
   {
     this.dialog.closeAll();
   }

   /*Start- function for create stripe token*/
   saveUser() {
    this.userService.userSignup(this.signupform.value)
    .subscribe(
        data => {
            this.displayResponse(data);
        },
        error => { 
          this.isFormValid = false;
          console.log(error);
          this.displayResponse(error);
        
        }); 
    }
   /*End- function for create stripe token*/

   opentermsPage()
   {
     //this.dialogRef.close();
     window.open(environment.SITE_URL+'terms', "_blank");
     //this.router.navigate(['terms']);
   }
}
