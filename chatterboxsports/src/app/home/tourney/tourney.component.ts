import { Component, OnInit } from '@angular/core';
import { ShareddialogComponent } from '../shareddialog/shareddialog.component';
import { AlertService, AuthenticationService }  from '../../common/index';
import { HomeService } from '../home.service';
import { environment } from 'src/environments/environment';
import { SignupComponent } from '../../user/signup/signup.component';
import { SigninComponent } from '../../user/signin/signin.component';
import { TourneySignupComponent } from '../../user/tourney-signup/tourney-signup.component';
import {MatDialog , MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment'

@Component({
  selector: 'app-tourney',
  templateUrl: './tourney.component.html',
  styleUrls: ['./tourney.component.css']
})
export class TourneyComponent implements OnInit {

  tourneyChannelVideos:any = [];
  tourneyChannelVideosData:any = [];
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
  userId:any;
  isUserLoggedIn:boolean = false;
  isCheckTourneyUser:boolean = false;
  isTourneyUser:number;
  isLivePlusUser:number;
  subscriptionData = [];
  isRecentSearchWorking:boolean = false;
  searchString:string;
  totalSearchVideos:any;
  constructor(public dialog: MatDialog,private alertService:AlertService,private homeService:HomeService,private authenticationService: AuthenticationService) { 
    authenticationService.getLoggedInUserName.subscribe( isUserLoggedIn => this.checkUsersession(isUserLoggedIn));
    authenticationService.checktourneyUser.subscribe( isCheckTourneyUser => this.checkUserPlan(isCheckTourneyUser));
  }

  ngOnInit(): void {
    this.getTourneyChannelData(0,6);
    if(localStorage.getItem('loggedInUser')) {
      this.getloggenInUser=  JSON.parse(localStorage.getItem('loggedInUser'));
      this.firstName = this.getloggenInUser.first_name;
      this.lastName = this.getloggenInUser.last_name;
      this.userEmail = this.getloggenInUser.email;
      this.userId = this.getloggenInUser.userId;
      this.fullname = this.firstName+' '+this.lastName;
      this.isUserLoggedIn = true;
      this.isTourneyUser = this.getloggenInUser.isTourneyUser;
      this.isLivePlusUser = this.getloggenInUser.isLivePlusUser;
      this.subscriptionData = this.getloggenInUser.subscriptions;
    }
  }

  private checkUsersession(isuserLoggedIn: boolean): void {
    this.isUserLoggedIn = isuserLoggedIn;
  }
  private checkUserPlan(isCheckTourneyUser: boolean): void {
    if(isCheckTourneyUser)
    {
      this.isTourneyUser = 1;
    }
  }

  /* Start- function for get live channel videos*/
  getTourneyChannelData(page,limit,isSeeAll=''){
    this.loader = true;
    if(isSeeAll != '')
    {
      this.isSeeAll = true;
    }
    else
    {
      this.isSeeAll = false;
    }
    this.tourneyChannelVideosData = [];
    this.homeService.getLiveChannel('4',page,limit).subscribe(
      response => {
        this.loader = false;
        if (response != undefined) {
          // if(response.data.future != undefined && response.data.future.length > 0)
          // {
          //   for(var i = 0; i< response.data.future.length; i++)
          //   {
          //     this.tourneyChannelVideosData.push(response.data.future[i]);
          //   }
          // }

          // if(response.data.live != undefined && response.data.live.length > 0)
          // {
          //   for(var i = 0; i< response.data.live.length; i++)
          //   {
          //     this.tourneyChannelVideosData.push(response.data.live[i]);
          //   }
          // }

          if(response.data != undefined && response.data.length > 0)
          {
            for(var i = 0; i< response.data.length; i++)
            {
              this.tourneyChannelVideosData.push(response.data[i]);
            }
          }
          if(response.total_records != undefined)
          {
            this.totalLivePlusVideos = response.total_records;
          }
         // this.tourneyChannelVideosData = response.data.live;
           this.tourneyChannelVideos = this.tourneyChannelVideosData;
           //this.totalLivePlusVideos = this.tourneyChannelVideosData.length;
           for(var i = 0; i<this.tourneyChannelVideos.length; i++)
           {
            //this.tourneyChannelVideos[i].durationTime = this.convertSecondsToHms(this.tourneyChannelVideos[i].recording_duration_seconds);
            this.tourneyChannelVideos[i].viewer_url = environment.BOXCAST_VIEWER_URL+this.tourneyChannelVideos[i].channel_id;
            this.tourneyChannelVideos[i].upcomingData = moment.utc(this.tourneyChannelVideos[i].starts_at).local().format(environment.UPCOMING_DATE_TIME_FORMAT);
            this.tourneyChannelVideos[i].starts_at = moment.utc(this.tourneyChannelVideos[i].starts_at).local().format(environment.DATE_TIME_FORMAT);
            this.tourneyChannelVideos[i].stops_at = moment.utc(this.tourneyChannelVideos[i].stops_at).local().format(environment.DATE_TIME_FORMAT);
           }
           this.getRecentGamesData(0,6,'');
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
      if(this.isLivePlusUser == 1)
      {
        if(this.isTourneyUser)
        {
          const dialogRef = this.dialog.open(ShareddialogComponent,{
            data: { videoUrl: url },
          });
      
          dialogRef.afterClosed().subscribe(result => {
            if(result != undefined && result != '')
            {
              //this.fullname = result;
            }
          });
        }
        else
        {
          this.openSigninDialog('tourney');
          return false;
        }
      }
      else
      {
          this.alertService.info('You do not have active CBOX + subscription.');
          return false;
      }
      
    }
    else
    {
       //this.alertService.info('Please login to watch CBOX + videos.');
       this.openSigninDialog('signin');
       return false;
    }
  }
  /* End-  function for open video dialog*/

  /* Start- function for get recent games videos*/
  getRecentGamesData(page,limit,searchString){
    this.loader = true;
    this.recentVideosData = [];
    this.homeService.getLiveChannel('4',page,limit,'past',searchString).subscribe(
      response => {
        this.loader = false;
        if (response != undefined) {
          if(response.data != undefined && response.data.length > 0)
          {
            for(var i = 0; i< response.data.length; i++)
            {
              this.recentVideosData.push(response.data[i]);
            }
          }
         
          if(response.total_records != undefined)
          {
            this.totalRecentVideos = response.total_records;
          }

          if(limit == 6 && searchString == '')
          {
            this.totalSearchVideos = this.totalRecentVideos;
          }
         // this.recentVideosData = response.data.recent;
           this.recentVideos = this.recentVideosData;
           //this.totalRecentVideos = this.recentVideosData.length;
           for(var i = 0; i<this.recentVideos.length; i++)
           {
            this.recentVideos[i].viewer_url = environment.BOXCAST_VIEWER_URL+this.recentVideos[i].channel_id;
            this.recentVideosData[i].durationTime =  moment.utc(moment(this.recentVideosData[i].stops_at).diff(moment(this.recentVideosData[i].starts_at))).format("HH:mm:ss");
            this.recentVideos[i].starts_at = moment.utc(this.recentVideos[i].starts_at).local().format(environment.DATE_TIME_FORMAT);
            this.recentVideos[i].stops_at = moment.utc(this.recentVideos[i].stops_at).local().format(environment.DATE_TIME_FORMAT);
           }
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
      this.getRecentGamesData(0,this.totalRecentVideos,'');
      //this.recentVideos = this.recentVideosData;
    }
    else
    {
      this.isSeeAllRecent = false;
      this.getRecentGamesData(0,6,'');
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
      this.getTourneyChannelData(0,this.totalLivePlusVideos,'true');
      //this.tourneyChannelVideos = this.tourneyChannelVideosData;
    }
    else
    {
      this.isSeeAll = false;
      this.getTourneyChannelData(0,6);
      //this.tourneyChannelVideos = this.tourneyChannelVideosData.slice(0,6);
    }
    setTimeout(()=>{this.loader = false; },2000);
  }


  openSigninDialog(type)
  {
    this.dialog.closeAll();
    if(type == 'tourney')
    {
      const dialogRef = this.dialog.open(TourneySignupComponent, {data: { isTourneyUser: this.isTourneyUser }});
      dialogRef.afterClosed().subscribe(result => {
        if(result != undefined)
        {
          this.isTourneyUser = result;
        }
      });
    }
    else
    {
      const dialogRefsingin = this.dialog.open(SigninComponent);
      dialogRefsingin.afterClosed().subscribe(result => {
        if(result != undefined)
        {
          
        }
      });
    }
    

    
  }

  closeDialog()
  {
    this.dialog.closeAll();
  }

  filterRecenttData()
  {
    var searchbox = document.getElementById("searchbox") as HTMLInputElement;
      if(searchbox.value != undefined && searchbox.value != '')
      {
        this.isRecentSearchWorking = true;
        this.searchString = searchbox.value;
        this.getRecentGamesData(0,this.totalSearchVideos,searchbox.value);
      }
      else
      {
           this.isRecentSearchWorking = false;
           this.searchString = '';
           this.getRecentGamesData(0,6,'');
      }
  }

}
