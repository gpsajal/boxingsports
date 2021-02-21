import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { AlertService }  from '../../common/index';
import { UserService }  from '../user.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  model: any = {};
  loader = false;
  resetpassform: FormGroup;
  password: FormControl;
  confirm_password: FormControl;
  isValidForm: boolean = null;
  token:string= '';
  ispasswordReset:boolean = false;
  verifyUserId:any;
  successMsg:any;
	

  constructor(private route: ActivatedRoute, private router: Router,
    private userService: UserService,
    private alertService: AlertService) {
    }

    ngOnInit() 
    {
      this.route.params.subscribe(params => {
      this.token = params['token']; 
      });
      
      this.verifyresetPasswordToken(this.token);
      this.createForm();
    }

  verifyresetPasswordToken(token){
   this.loader = true;
    this.userService.verifyresetPassword(token)
      .subscribe(
          data => {
            if(data)
            {
              this.displayResponse(data,'verifytoken');
            }
          },
          error => { 
            this.displayResponse(error,'verifytoken');
          });  
  }
  
  
    createForm() {
      this.password = new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        //Validators.maxLength(10),
        Validators.pattern(/^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)$/)
      ]);
      this.confirm_password = new FormControl('', [
        Validators.required
      ]);
      this.resetpassform = new FormGroup({
        password: this.password,
        confirm_password: this.confirm_password
      });
    }


 showErrors(errortype:string) {
  if(errortype == 'password'){
    return  this.password.hasError('required') ? 'This Field is required.' :
                this.password.hasError('minlength') ? 'Password must contain at least 4 characters.' :
                this.password.hasError('pattern') ? 'Password must contain one uppercase and number.' :
                '';
    }else if(errortype == 'confirmpassword'){
      return  this.confirm_password.hasError('required') ? 'This Field is required.' :
      this.confirm_password.hasError('confirmpassword') ? 'Password does not match.' :
              '';
    }            
  }

  resetpassword() {
    this.isValidForm = false;
	  if(this.resetpassform.invalid){
		  return;	
	  }
    this.isValidForm = true;	
    this.loader = true;
    this.model.noToken = true;
    this.model.id = this.verifyUserId;
    delete this.model.confirm_password;
    this.userService.resetPassword(this.model)
    .subscribe(
      data => 
      {
        this.displayResponse(data);
      },
      error => 
      {
        this.displayResponse(error);
      });
  }
  

  displayResponse(responseobject,type='') {
    this.loader = false;
    console.log(responseobject);
    if (responseobject.status === 400) {
     var errordata = responseobject.error.message;
     this.alertService.error(errordata);
     if(type == 'verifytoken')
     {
       setTimeout(()=>{ this.router.navigate(['pagenotfound']);},10000);
     }
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
      
      if(type == '')
      {
        this.successMsg = responseobject.message;
        //this.alertService.success(successMsg);
        this.ispasswordReset = true;
      }
      else if(type == 'verifytoken')
      {
        if(responseobject.data._id != undefined)
        {
          this.verifyUserId = responseobject.data._id;
        }
      }
    }
   }

 
}
