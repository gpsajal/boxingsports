import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-cancelsubscription',
  templateUrl: './cancelsubscription.component.html',
  styleUrls: ['./cancelsubscription.component.css']
})
export class CancelsubscriptionComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  closeDialog()
  {
    this.dialog.closeAll();
  }

  cancelSubscription()
  {
    
  }

}
