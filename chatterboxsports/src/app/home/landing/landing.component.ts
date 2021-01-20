import { Component, OnInit } from '@angular/core';
import { ShareddialogComponent } from '../shareddialog/shareddialog.component';
import {MatDialog} from '@angular/material/dialog';
import { AlertService, AuthenticationService }  from '../../common/index';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(public dialog: MatDialog,private alertService:AlertService) { }

  ngOnInit(): void {
  }

  openVideoDialog(url)
  {
    const dialogRef = this.dialog.open(ShareddialogComponent,{
      data: { videoUrl: url },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('Dialog result:'+result);
      if(result != undefined && result != '')
      {
        //this.fullname = result;
      }
    });
  }

}
