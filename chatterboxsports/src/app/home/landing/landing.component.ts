import { Component, OnInit } from '@angular/core';
import { ShareddialogComponent } from '../shareddialog/shareddialog.component';
import {MatDialog} from '@angular/material/dialog';
import { AlertService, AuthenticationService }  from '../../common/index';
import { HomeService } from '../home.service';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(public dialog: MatDialog,private alertService:AlertService,private homeService:HomeService) { }
  liveChannelVideos:any = [];
  instantClassicChannelVideos:any = [];
  loader:boolean =false;
  ngOnInit(): void {
    this.getLiveChannelData();
    this.getInstantClassicChannelData();
  }

  /* Start- function for open video dialog*/
  openVideoDialog(url)
  {
    console.log(url);
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
  /* End-  function for open video dialog*/

  /* Start- function for get live channel videos*/
  getLiveChannelData(){
    this.loader = true;
    this.homeService.getLiveChannel('1').subscribe(
      response => {
        this.loader = false;
        if (response != undefined) {
          console.log(response);
           this.liveChannelVideos = response.data;
           console.log(this.liveChannelVideos);
        }
      },
    error => {

    });
  }
  /* End- function for get live channel videos*/

  /* Start- function for get live channel videos*/
  getInstantClassicChannelData(){
    this.loader = true;
    this.homeService.getLiveChannel('1').subscribe(
      response => {
        this.loader = false;
        if (response != undefined) {
          console.log(response);
           this.instantClassicChannelVideos = response.data;
           console.log(this.instantClassicChannelVideos);
           for(var i = 0; i<this.instantClassicChannelVideos.length; i++)
           {
            this.instantClassicChannelVideos[i].durationTime = this.convertSecondsToHms(this.instantClassicChannelVideos[i].recording_duration_seconds);
           }
           console.log(this.instantClassicChannelVideos);
        }
      },
    error => {

    });
  }
  /* End- function for get live channel videos*/

   convertSecondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    //  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    //  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    //  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
     var hDisplay = h > 0 ? h + (h == 1 ? ":" : ":") : "";
     var mDisplay = m > 0 ? m + (m == 1 ? ":" : ":") : "";
     var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "";
    return hDisplay + mDisplay + sDisplay; 
  }

}
