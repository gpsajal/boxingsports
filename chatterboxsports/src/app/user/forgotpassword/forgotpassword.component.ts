import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog , MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { UserService }  from '../user.service';
import { environment } from '../../../environments/environment';
import { AlertService }  from '../../common/index';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  loader:boolean = false;
  forgotpassform: FormGroup;
  email: FormControl;
  password: FormControl;
  isValidForm: boolean = null;
  model: any = {};
  isforgotemailsent:boolean = false;
  successdata:any;
  
    constructor(private router: Router,
      private userService: UserService,
      private alertService: AlertService,
      private dialog: MatDialog,
      public dialogRef: MatDialogRef<ForgotpasswordComponent>) 
      { }


  ngOnInit() {
    this.createForm();
  }

  
  createForm() {
    this.email = new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z][A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-z]{2,4}$/)
    ]);
    this.forgotpassform = new FormGroup({
      email: this.email
    });
  }


  /*Start- Form validations messages*/
  showErrors(errortype:string) {
    if(errortype == 'email'){
       return  this.email.hasError('required') ? 'Please enter your registered email address.' :
               this.email.hasError('email') ? 'Please enter valid email.':
               this.email.hasError('pattern') ? 'Please enter valid email.' :
               '';
     }       
   }
   /*End- Form validations messages*/


   forgotpassword() 
   {
    this.isValidForm = false;
	  if(this.forgotpassform.invalid){
		  return;	
	  }
    this.isValidForm = true;	
    this.loader = true;
    this.userService.forgotPassword(this.model).subscribe(
      data => {
        this.displayResponse(data);
      },
      error => {
        this.displayResponse(error);
      });
  }
  

   /*Start- function to display alert messages */
   displayResponse(responseobject) {
    this.loader = false;
    console.log(responseobject);
    if (responseobject.status === 400) {
     var errordata = responseobject.error.message;
     this.alertService.error(errordata);
    }
    else if (responseobject.status === 404) {
      var errordata = responseobject.error.message;
     this.alertService.error(errordata);
    }
    else if (responseobject.status === 409) {
      var infodata = responseobject.error.message;
      this.alertService.info(infodata);
    }
    else {
      this.successdata = responseobject.message;
      //this.alertService.success(this.successdata);
      this.isforgotemailsent = true;
    }
   }
   /*End- function to display alert messages */

  closeDialog(){
    this.dialogRef.close();
  }



}
