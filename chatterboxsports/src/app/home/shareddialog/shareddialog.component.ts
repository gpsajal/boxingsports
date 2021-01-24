import { Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
@Component({
  selector: 'app-shareddialog',
  templateUrl: './shareddialog.component.html',
  styleUrls: ['./shareddialog.component.css']
})
export class ShareddialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public shareddata: any,private _sanitizer: DomSanitizer,public dialog: MatDialog) { }
  videoUrl:any;
  ngOnInit(): void {
    if(this.shareddata.videoUrl != undefined && this.shareddata.videoUrl != '')
    {
      this.videoUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.shareddata.videoUrl);
      //console.log(this.videoUrl);
    }
  }


  closeDialog()
  {
    this.dialog.closeAll();
  }
}
