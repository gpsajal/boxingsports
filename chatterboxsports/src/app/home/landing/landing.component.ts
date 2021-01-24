import { Component, OnInit } from '@angular/core';
import { ShareddialogComponent } from '../shareddialog/shareddialog.component';
import {MatDialog} from '@angular/material/dialog';
import { AlertService, AuthenticationService }  from '../../common/index';
import { HomeService } from '../home.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment'
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(public dialog: MatDialog,private alertService:AlertService,private homeService:HomeService) { }
  liveChannelVideos:any = [];
  instantClassicChannelVideos:any = [];
  recentVideos:any = [];
  loader:boolean =false;
  totalLiveVideos:any;
  totalInstantVideos:any;
  totalRecentVideos:any;
  isSeeAll:boolean = false;
  isSeeAllInstant:boolean = false;
  isSeeAllRecent:boolean = false;
  ngOnInit(): void {
    this.getLiveChannelData(0,6);
    this.getInstantClassicChannelData(0,6);
  }

  /* Start- function for open video dialog*/
  openVideoDialog(url)
  {
   // console.log(url);
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
  getLiveChannelData(page,limit,isSeeAll=''){
    this.loader = true;
    if(isSeeAll != '')
    {
      this.isSeeAll = true;
    }
    else
    {
      this.isSeeAll = false;
    }
    this.homeService.getLiveChannel('1',page,limit).subscribe(
      response => {
        this.loader = false;
        if (response != undefined) {
          //console.log(response);
           this.liveChannelVideos = response.data;
           this.totalLiveVideos = response.total_records
           for(var i = 0; i<this.liveChannelVideos.length; i++)
           {
            this.liveChannelVideos[i].viewer_url = environment.BOXCAST_VIEWER_URL+this.liveChannelVideos[i].channel_id;
           }
           //console.log(this.liveChannelVideos);
           this.getRecentGamesData(0,1000);
        }
      },
    error => {
      this.loader = false;
      this.isSeeAll = false;
    });
  }
  /* End- function for get live channel videos*/

  /* Start- function for get Instant channel videos*/
  getInstantClassicChannelData(page,limit,isSeeAllInstant=''){
    this.loader = true;
    if(isSeeAllInstant != '')
    {
      this.isSeeAllInstant = true;
    }
    else
    {
      this.isSeeAllInstant = false;
    }
    this.homeService.getLiveChannel('2',page,limit).subscribe(
      response => {
        this.loader = false;
        if (response != undefined) {
          //console.log(response);
           this.instantClassicChannelVideos = response.data;
           this.totalInstantVideos = response.total_records
           //console.log(this.instantClassicChannelVideos);
           for(var i = 0; i<this.instantClassicChannelVideos.length; i++)
           {
            this.instantClassicChannelVideos[i].durationTime = this.convertSecondsToHms(this.instantClassicChannelVideos[i].recording_duration_seconds);
            this.instantClassicChannelVideos[i].viewer_url = environment.BOXCAST_VIEWER_URL+this.instantClassicChannelVideos[i].channel_id;
            this.instantClassicChannelVideos[i].starts_at = moment(this.instantClassicChannelVideos[i].starts_at).format(environment.DATE_TIME_FORMAT);
            this.instantClassicChannelVideos[i].stops_at = moment(this.instantClassicChannelVideos[i].stops_at).format(environment.DATE_TIME_FORMAT);
           }
           //console.log(this.instantClassicChannelVideos);
        }
      },
    error => {
      this.loader = false;
      this.isSeeAllInstant = false;
    });
  }
  /* End- function for get Instant channel videos*/

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

  /* Start- function for get recent games videos*/
  getRecentGamesData(page,limit,isSeeAllRecent=''){
    this.loader = true;
    if(isSeeAllRecent != '')
    {
      this.isSeeAllRecent = true;
    }
    else
    {
      this.isSeeAllRecent = false;
    }
    this.homeService.getLiveChannel('4',page,limit).subscribe(
      response => {
        this.loader = false;
        if (response != undefined) {
          //console.log(response);
           this.recentVideos = response.data;
           this.totalRecentVideos = response.total_records
           for(var i = 0; i<this.recentVideos.length; i++)
           {
            this.recentVideos[i].viewer_url = environment.BOXCAST_VIEWER_URL+this.recentVideos[i].channel_id;
            this.recentVideos[i].starts_at = moment(this.recentVideos[i].starts_at).format(environment.DATE_TIME_FORMAT);
            this.recentVideos[i].stops_at = moment(this.recentVideos[i].stops_at).format(environment.DATE_TIME_FORMAT);
           }
           //console.log(this.recentVideos);
        }
      },
    error => {
      this.loader = false;
      this.isSeeAllRecent = false;
    });
  }
  /* End- function for get recent games videos*/

}
