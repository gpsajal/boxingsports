import { Component, OnInit } from '@angular/core';
import { ShareddialogComponent } from '../shareddialog/shareddialog.component';
import {MatDialog} from '@angular/material/dialog';
import { AlertService, AuthenticationService }  from '../../common/index';
import { HomeService } from '../home.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-liveplus',
  templateUrl: './liveplus.component.html',
  styleUrls: ['./liveplus.component.css']
})
export class LiveplusComponent implements OnInit {
  livePlusChannelVideos:any = [];
  recentVideos:any = [];
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
           this.livePlusChannelVideos = response.data;
           this.totalLivePlusVideos = response.total_records;
           for(var i = 0; i<this.livePlusChannelVideos.length; i++)
           {
            //this.livePlusChannelVideos[i].durationTime = this.convertSecondsToHms(this.livePlusChannelVideos[i].recording_duration_seconds);
            this.livePlusChannelVideos[i].viewer_url = environment.BOXCAST_VIEWER_URL+this.livePlusChannelVideos[i].channel_id;
           }
           //console.log(this.livePlusChannelVideos);
           this.getRecentGamesData(0,1000);
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
       this.alertService.info('Please login to watch live+ videos.');
       return false;
    }
  }
  /* End-  function for open video dialog*/

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
    this.homeService.getLiveChannel('5',page,limit).subscribe(
      response => {
        this.loader = false;
        if (response != undefined) {
          //console.log(response);
           this.recentVideos = response.data;
           this.totalRecentVideos = response.total_records
           for(var i = 0; i<this.recentVideos.length; i++)
           {
            this.recentVideos[i].viewer_url = environment.BOXCAST_VIEWER_URL+this.recentVideos[i].channel_id;
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
