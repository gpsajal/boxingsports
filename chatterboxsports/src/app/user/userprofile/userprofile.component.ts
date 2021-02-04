import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CancelsubscriptionComponent } from '../../user/cancelsubscription/cancelsubscription.component';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  

   opencancelDialog()
  {
    const dialogRef = this.dialog.open(CancelsubscriptionComponent);
  
  }

   

}
