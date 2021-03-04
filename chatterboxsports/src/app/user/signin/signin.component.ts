import { Component, OnInit,Inject } from '@angular/core';
import { SignupComponent } from '../signup/signup.component';
import { ForgotpasswordComponent } from '../Forgotpassword/Forgotpassword.component';
import {MatDialog , MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserService } from '../user.service';
import { Router,ActivatedRoute } from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AlertService, AuthenticationService }  from '../../common/index';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  model: any = {};
  signinform: FormGroup;
  email: FormControl;
  password: FormControl;
  isFormValid: boolean = null;
  loader:boolean = false;
  userFullname:string;
  userEmail:string;
  returnUrl: string;
  constructor(private userService: UserService,public dialog: MatDialog, private alertService:AlertService, private authservice:AuthenticationService,public dialogRef: MatDialogRef<SigninComponent>, @Inject(MAT_DIALOG_DATA) public data: any,private route: ActivatedRoute,
  private router: Router) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.createForm();
  }

  openSignupDialog()
  {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(SignupComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  openForgotPasswordDialog()
  {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(ForgotpasswordComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  closeDialog()
  {
    this.dialog.closeAll();
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
    this.email = new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z][A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-z]{2,4}$/)
    ]);
    this.password = new FormControl('', [
      Validators.required,
      //Validators.minLength(8),
      //Validators.maxLength(20),
     // Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[ !"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~]{5,10}$/)
    ]);
   
    this.signinform = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }
  /* end- function for create form*/

  
  /*start- user signup function */
  submitSiginForm() {
    this.isFormValid = false;
	  if(this.signinform.invalid){
		  return;	
    }
    this.isFormValid = true;	
    this.loader = true;
    this.authservice.userSignIn(this.model.email,this.model.password)
        .subscribe(
            data => {
                this.displayResponse(data);
                
            },
            error => { 
              this.isFormValid = false;
              this.displayResponse(error);
            }); 
  }
  /*end- user signup function */

    /*start- signup form validations messages*/
    showErrors(errortype:string) {
     
      if(errortype == 'email')
      {
        return  this.email.hasError('required') ? 'This Field is required.' :
                this.email.hasError('email') ? 'Please enter valid email.' :
                this.email.hasError('pattern') ? 'Please enter valid email.' :
                '';
  
      }
      else if(errortype == 'password')
      {
        return  this.password.hasError('required') ? 'This Field is required.' :
                '';
      }      
    }
    /*end- signup form validations messages*/

    /*Start- function to display alert messages */
  displayResponse(responseobject) {
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
      this.userFullname = responseobject.data.first_name+' '+responseobject.data.last_name;
      this.userEmail = responseobject.data.email;;
      this.dialogRef.close(this.userFullname);
      if(this.returnUrl != "/" && this.router.url != "/" )
      {
        this.router.navigateByUrl(this.returnUrl);
      }else
      {
        this.router.navigate(['/']);
      }
    }
   }
   /*End- function to display alert messages */


}
