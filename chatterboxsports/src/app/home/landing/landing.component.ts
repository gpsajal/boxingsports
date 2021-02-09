import { Component, OnInit } from '@angular/core';
import { ShareddialogComponent } from '../shareddialog/shareddialog.component';
import {MatDialog} from '@angular/material/dialog';
import { AlertService, AuthenticationService }  from '../../common/index';
import { HomeService } from '../home.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
var find = require('arraysearch').Finder;
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(public dialog: MatDialog,private alertService:AlertService,private homeService:HomeService) { }
  liveChannelVideos:any = [];
  liveChannelVideosData:any = [];
  instantClassicChannelVideos:any = [];
  recentVideos:any = [];
  recentVideosData:any = [];
  loader:boolean =false;
  totalLiveVideos:any;
  totalInstantVideos:any;
  totalRecentVideos:any;
  isSeeAll:boolean = false;
  isSeeAllInstant:boolean = false;
  isSeeAllRecent:boolean = false;
  recentTempData:any = [];
  isRecentSearchWorking:boolean = false;
  getloggenInUser:any ={};
  userId:any;
  userEmail:string;
  firstName:string;
  lastName:string;
  fullname:string;
  isTourneyUser:number;
  ngOnInit(): void {
    this.getLiveChannelData(0,6);
    if(localStorage.getItem('loggedInUser')) {
      this.getloggenInUser=  JSON.parse(localStorage.getItem('loggedInUser'));
      this.userId = this.getloggenInUser.userId;
      this.firstName = this.getloggenInUser.first_name;
      this.lastName = this.getloggenInUser.last_name;
      this.userEmail = this.getloggenInUser.email;
      this.fullname = this.firstName+' '+this.lastName;
      this.isTourneyUser = this.getloggenInUser.isTourneyUser;
    }
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
  getLiveChannelData(page,limit){
    this.loader = true;
    this.liveChannelVideosData = [];
    this.homeService.getLiveChannel('1',page,limit).subscribe(
      response => {
        //this.loader = false;
        if (response != undefined) {
         
          if(response.data.live != undefined && response.data.live.length > 0)
          {
            for(var i = 0; i< response.data.live.length; i++)
            {
              this.liveChannelVideosData.push(response.data.live[i]);
            }
          }
          if(response.data.future != undefined && response.data.future.length > 0)
          {
            for(var i = 0; i< response.data.future.length; i++)
            {
              this.liveChannelVideosData.push(response.data.future[i]);
            }
          }

          if(response.total_records != undefined)
          {
            this.totalLiveVideos = response.total_records;
          }
           this.liveChannelVideos = this.liveChannelVideosData;
           //this.totalLiveVideos = this.liveChannelVideosData.length;
           for(var i = 0; i<this.liveChannelVideos.length; i++)
           {
            this.liveChannelVideos[i].viewer_url = environment.BOXCAST_VIEWER_URL+this.liveChannelVideos[i].channel_id;
            this.liveChannelVideos[i].upcomingData = moment.utc(this.liveChannelVideos[i].starts_at).local().format(environment.UPCOMING_DATE_TIME_FORMAT);
            this.liveChannelVideos[i].starts_at = moment.utc(this.liveChannelVideos[i].starts_at).local().format(environment.DATE_TIME_FORMAT);
            this.liveChannelVideos[i].stops_at = moment.utc(this.liveChannelVideos[i].stops_at).local().format(environment.DATE_TIME_FORMAT);
           }
           //console.log(this.liveChannelVideos);
           this.getRecentGamesData(0,6);
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
   
    if(isSeeAllInstant != '')
    {
      this.isSeeAllInstant = true;
       this.loader = true;
    }
    else
    {
      this.isSeeAllInstant = false;
    }
    this.instantClassicChannelVideos = [];
    this.homeService.getLiveChannel('2',page,limit).subscribe(
      response => {
        this.loader = false;
        if (response != undefined) {
          // if(response.data.future != undefined && response.data.future.length > 0)
          // {
          //   for(var i = 0; i< response.data.future.length; i++)
          //   {
          //     this.instantClassicChannelVideos.push(response.data.future[i]);
          //   }
          // }

          // if(response.data.live != undefined && response.data.live.length > 0)
          // {
          //   for(var i = 0; i< response.data.live.length; i++)
          //   {
          //     this.instantClassicChannelVideos.push(response.data.live[i]);
          //   }
          // }
         
          // if(response.data.past != undefined && response.data.past.length > 0)
          // {
          //   for(var i = 0; i< response.data.past.length; i++)
          //   {
          //     this.instantClassicChannelVideos.push(response.data.past[i]);
          //   }
          // }

          if(response.data != undefined && response.data.length > 0)
          {
            for(var i = 0; i< response.data.length; i++)
            {
              this.instantClassicChannelVideos.push(response.data[i]);
            }
          }
         
          if(response.total_records != undefined)
          {
            this.totalInstantVideos = response.total_records;
          }
           //this.totalInstantVideos = this.instantClassicChannelVideos.length;
           //console.log(this.instantClassicChannelVideos);
           for(var i = 0; i<this.instantClassicChannelVideos.length; i++)
           {
           // this.instantClassicChannelVideos[i].durationTime = this.convertSecondsToHms(this.instantClassicChannelVideos[i].recording_duration_seconds);
            this.instantClassicChannelVideos[i].durationTime =  moment.utc(moment(this.instantClassicChannelVideos[i].stops_at).diff(moment(this.instantClassicChannelVideos[i].starts_at))).format("HH:mm:ss");
            this.instantClassicChannelVideos[i].viewer_url = environment.BOXCAST_VIEWER_URL+this.instantClassicChannelVideos[i].channel_id;
            this.instantClassicChannelVideos[i].starts_at = moment.utc(this.instantClassicChannelVideos[i].starts_at).local().format(environment.DATE_TIME_FORMAT);
            this.instantClassicChannelVideos[i].stops_at = moment.utc(this.instantClassicChannelVideos[i].stops_at).local().format(environment.DATE_TIME_FORMAT);
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
  getRecentGamesData(page,limit){
    this.loader = true;
    this.recentVideosData = [];
    this.homeService.getLiveChannel('1',page,limit).subscribe(
      response => {
        
        if (response != undefined) {
          //console.log(response);
          this.recentVideosData = response.data.past;
          if(response.total_records != undefined)
          {
            this.totalRecentVideos = response.total_records;
          }
           this.convertDateutctolocal((err,data)=>{
             if(data)
             {
              this.recentVideos = this.recentVideosData;
              this.recentTempData = this.recentVideosData;
              //this.totalRecentVideos = this.recentVideosData.length;
              this.getInstantClassicChannelData(0,6);
              //this.loader = false;
             }
           });
           
           
        }
      },
    error => {
      this.loader = false;
      //this.isSeeAllRecent = false;
    });
  }
  /* End- function for get recent games videos*/

  convertDateutctolocal(callback)
  {
    if(this.recentVideosData.length > 0)
    {
      for(var i = 0; i<this.recentVideosData.length; i++)
      {
        this.recentVideosData[i].viewer_url = environment.BOXCAST_VIEWER_URL+this.recentVideosData[i].channel_id;
        this.recentVideosData[i].durationTime =  moment.utc(moment(this.recentVideosData[i].stops_at).diff(moment(this.recentVideosData[i].starts_at))).format("HH:mm:ss");
        this.recentVideosData[i].starts_at = moment.utc(this.recentVideosData[i].starts_at).local().format(environment.DATE_TIME_FORMAT);
        this.recentVideosData[i].stops_at = moment.utc(this.recentVideosData[i].stops_at).local().format(environment.DATE_TIME_FORMAT);
        if(i == this.recentVideosData.length-1)
        {
          //console.log('jsdj');
          callback('',true); 
        }
      }
    }
    
  }

  seeAllRecent(isSeeAllRecent)
  {
    this.loader = true;
    if(isSeeAllRecent == 'true')
    {
      this.isSeeAllRecent = true;
      this.getRecentGamesData(0,this.totalRecentVideos);
      //this.recentVideos = this.recentVideosData;
    }
    else
    {
      this.isSeeAllRecent = false;
      this.getRecentGamesData(0,6);
      //this.recentVideos = this.recentVideosData.slice(0,6);
    }
    setTimeout(()=>{this.loader = false; },2000);
  }

  seeAllLive(isSeeAll)
  {
    this.loader = true;
    if(isSeeAll == 'true')
    {
      this.isSeeAll = true;
      //this.liveChannelVideos = this.liveChannelVideosData;
      this.getLiveChannelData(0,this.totalLiveVideos);
    }
    else
    {
      this.isSeeAll = false;
      //this.liveChannelVideos = this.liveChannelVideosData;
      this.getLiveChannelData(0,6);
    }
    setTimeout(()=>{this.loader = false; },2000);
  }

  filterRecenttData(value)
  {
      if(value != undefined && value != '')
      {
        this.isRecentSearchWorking = true;
        //this.recentVideos = find.one.in(this.recentVideosData).with({"name":value});
        this.recentVideos = this.recentVideosData.filter(item => {
          if((item.name != null ) && item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
            return true;
          }
          return false;
        });
      }
      else
      {
           this.isRecentSearchWorking = false;
           this.recentVideos = this.recentVideosData.slice(0,6);
      }
  }


}
