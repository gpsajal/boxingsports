import { Component, OnInit } from '@angular/core';
import { SignupComponent } from '../signup/signup.component';
import {MatDialog} from '@angular/material/dialog';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openSignupDialog()
  {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(SignupComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  closeDialog()
  {
    this.dialog.closeAll();
  }

}
