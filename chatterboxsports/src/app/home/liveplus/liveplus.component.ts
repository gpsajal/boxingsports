import { Component, OnInit } from '@angular/core';
import { ShareddialogComponent } from '../shareddialog/shareddialog.component';
import { AlertService, AuthenticationService }  from '../../common/index';
import { HomeService } from '../home.service';
import { environment } from 'src/environments/environment';
import { SignupComponent } from '../../user/signup/signup.component';
import { SigninComponent } from '../../user/signin/signin.component';
import {MatDialog , MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment'
@Component({
  selector: 'app-liveplus',
  templateUrl: './liveplus.component.html',
  styleUrls: ['./liveplus.component.css']
})
export class LiveplusComponent implements OnInit {
  livePlusChannelVideos:any = [];
  livePlusChannelVideosData:any = [];
  recentVideos:any = [];
  recentVideosData:any = [];
  loader:boolean =false;
  totalLivePlusVideos:any;
  totalRecentVideos:any;
  isSeeAll:boolean = false;
  isSeeAllRecent:boolean = false;
  getloggenInUser:any ={};
  userEmail:string;
  firstName:string;
  lastName:string;
  fullname:string;
  isUserLoggedIn:boolean = false;
  isTourneyUser:boolean = false;
  constructor(public dialog: MatDialog,private alertService:AlertService,private homeService:HomeService,private authenticationService: AuthenticationService) { 
    authenticationService.getLoggedInUserName.subscribe( isUserLoggedIn => this.checkUsersession(isUserLoggedIn));
  }

  ngOnInit(): void {
    this.getLiveplusChannelData(0,6);
    if(localStorage.getItem('loggedInUser')) {
      this.getloggenInUser=  JSON.parse(localStorage.getItem('loggedInUser'));
      this.firstName = this.getloggenInUser.first_name;
      this.lastName = this.getloggenInUser.last_name;
      this.userEmail = this.getloggenInUser.email;
      this.isTourneyUser = this.getloggenInUser.isTourneyUser;
      this.fullname = this.firstName+' '+this.lastName;
      this.isUserLoggedIn = true;
    }
  }

  private checkUsersession(isuserLoggedIn: boolean): void {
    this.isUserLoggedIn = isuserLoggedIn;
  }

  /* Start- function for get live channel videos*/
  getLiveplusChannelData(page,limit,isSeeAll=''){
    this.loader = true;
    if(isSeeAll != '')
    {
      this.isSeeAll = true;
    }
    else
    {
      this.isSeeAll = false;
    }
    this.homeService.getLiveChannel('3',page,limit).subscribe(
      response => {
        this.loader = false;
        if (response != undefined) {
          //console.log(response);
          //this.livePlusChannelVideosData = response.data.live;
          if(response.data.future != undefined && response.data.future.length > 0)
          {
            for(var i = 0; i< response.data.future.length; i++)
            {
              this.livePlusChannelVideosData.push(response.data.future[i]);
            }
          }

          if(response.data.live != undefined && response.data.live.length > 0)
          {
            for(var i = 0; i< response.data.live.length; i++)
            {
              this.livePlusChannelVideosData.push(response.data.live[i]);
            }
          }
         
          if(response.data.total != undefined)
          {
            this.totalLivePlusVideos = response.data.total;
          }
           this.livePlusChannelVideos = this.livePlusChannelVideosData;
          // this.totalLivePlusVideos = this.livePlusChannelVideosData.length;
           for(var i = 0; i<this.livePlusChannelVideos.length; i++)
           {
            //this.livePlusChannelVideos[i].durationTime = this.convertSecondsToHms(this.livePlusChannelVideos[i].recording_duration_seconds);
            this.livePlusChannelVideos[i].viewer_url = environment.BOXCAST_VIEWER_URL+this.livePlusChannelVideos[i].channel_id;
            this.livePlusChannelVideos[i].upcomingData = moment.utc(this.livePlusChannelVideos[i].starts_at).local().format(environment.UPCOMING_DATE_TIME_FORMAT);
            this.livePlusChannelVideos[i].starts_at = moment.utc(this.livePlusChannelVideos[i].starts_at).local().format(environment.DATE_TIME_FORMAT);
            this.livePlusChannelVideos[i].stops_at = moment.utc(this.livePlusChannelVideos[i].stops_at).local().format(environment.DATE_TIME_FORMAT);
           }
           //console.log(this.livePlusChannelVideos);
           this.getRecentGamesData(0,6);
        }
      },
    error => {
      this.loader = false;
      this.isSeeAll = false;
    });
  }
  /* End- function for get live channel videos*/

  /* Start- function for open video dialog*/
  openVideoDialog(url)
  {
    if(this.isUserLoggedIn)
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
    else
    {
       //this.alertService.info('Please login to watch live+ videos.');
       this.openSignupDialog();
       return false;
    }
  }
  /* End-  function for open video dialog*/

  /* Start- function for get recent games videos*/
  getRecentGamesData(page,limit){
    this.loader = true;
    this.homeService.getLiveChannel('3',page,limit).subscribe(
      response => {
        this.loader = false;
        if (response != undefined) {
          
          if(response.data.past != undefined && response.data.past.length > 0)
          {
            for(var i = 0; i< response.data.past.length; i++)
            {
              this.recentVideosData.push(response.data.past[i]);
            }
          }
         
          if(response.data.total != undefined)
          {
            this.totalRecentVideos = response.data.total;
          }
          //this.recentVideosData = response.data.recent;
           this.recentVideos = this.recentVideosData;
           //this.totalRecentVideos = this.recentVideosData.length;
           for(var i = 0; i<this.recentVideos.length; i++)
           {
            this.recentVideos[i].viewer_url = environment.BOXCAST_VIEWER_URL+this.recentVideos[i].channel_id;
            this.recentVideosData[i].durationTime =  moment.utc(moment(this.recentVideosData[i].stops_at).diff(moment(this.recentVideosData[i].starts_at))).format("HH:mm:ss");
            this.recentVideos[i].starts_at = moment.utc(this.recentVideos[i].starts_at).local().format(environment.DATE_TIME_FORMAT);
            this.recentVideos[i].stops_at = moment.utc(this.recentVideos[i].stops_at).local().format(environment.DATE_TIME_FORMAT);
           }
           //console.log(this.recentVideos);
        }
      },
    error => {
      this.loader = false;
      //this.isSeeAllRecent = false;
    });
  }
  /* End- function for get recent games videos*/

  seeAllRecent(isSeeAllRecent)
  {
    this.loader = true;
    if(isSeeAllRecent == 'true')
    {
      this.isSeeAllRecent = true;
      this.getRecentGamesData(0,this.recentVideosData);
      //this.recentVideos = this.recentVideosData;
    }
    else
    {
      this.isSeeAllRecent = false;
      this.recentVideos = this.recentVideosData.slice(0,6);
    }
    setTimeout(()=>{this.loader = false; },2000);
  }

  seeAllLive(isSeeAll)
  {
    this.loader = true;
    if(isSeeAll == 'true')
    {
      this.isSeeAll = true;
      this.getLiveplusChannelData(0,this.totalLivePlusVideos);
      //this.livePlusChannelVideos = this.livePlusChannelVideosData;
    }
    else
    {
      this.isSeeAll = false;
      this.livePlusChannelVideos = this.livePlusChannelVideosData.slice(0,6);
    }
    setTimeout(()=>{this.loader = false; },2000);
  }


  openSignupDialog()
  {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(SigninComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  closeDialog()
  {
    this.dialog.closeAll();
  }



}
