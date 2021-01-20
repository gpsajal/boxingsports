import { Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-shareddialog',
  templateUrl: './shareddialog.component.html',
  styleUrls: ['./shareddialog.component.css']
})
export class ShareddialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public shareddata: any) { }
  videoUrl:string;
  ngOnInit(): void {
    if(this.shareddata.videoUrl != undefined && this.shareddata.videoUrl != '')
    {
      this.videoUrl = this.shareddata.videoUrl;
    }
  }

}
