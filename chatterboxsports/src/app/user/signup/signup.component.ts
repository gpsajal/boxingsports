import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';
//import { setTimeout } from 'timers';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupform: FormGroup;
  first_name: FormControl;
  last_name: FormControl;
  email_address: FormControl;
  confirm_email_address: FormControl;
  password: FormControl;
  confirm_password: FormControl;
  terms: FormControl;
  isFormValid: boolean = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
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
      Validators.minLength(8),
      Validators.maxLength(20),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[ !"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~]{8,20}$/)
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
  // submitSignupForm() {
  //   this.isValidFormSubmitted = false;
	//   if(this.signupform.invalid){
	// 	  return;	
  //   }
  //   this.isValidFormSubmitted = true;	
  //   this.loader = true;

  //   this.userService.userSignup(this.signupform.value)
  //       .subscribe(
  //           data => {
  //               this.showErrors(data);
  //           },
  //           error => { 
  //             this.isValidFormSubmitted = false;
  //             this.showErrors(error);
  //           }); 
  // }
  /*end- user signup function */

}
