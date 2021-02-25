import { Component, OnInit, ViewChild ,AfterViewInit,ChangeDetectorRef} from '@angular/core';
import { ShareddialogComponent } from '../shareddialog/shareddialog.component';
import { AlertService, AuthenticationService }  from '../../common/index';
import { HomeService } from '../home.service';
import { environment } from 'src/environments/environment';
import { SignupComponent } from '../../user/signup/signup.component';
import { SigninComponent } from '../../user/signin/signin.component';
import {MatDialog , MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment'
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface UserData {
  MATCHUP: string;
  TIME	: string;
  CHANNEL	: string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})

export class ScheduleComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['MATCHUP', 'TIME', 'CHANNEL'];
  dataSource: MatTableDataSource<UserData>;

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
  isLivePlusUser:number;
  subscriptionData = [];
  tabledata:any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public dialog: MatDialog,private alertService:AlertService,private homeService:HomeService,private authenticationService: AuthenticationService,private changeDetectorRefs: ChangeDetectorRef) { 
    authenticationService.getLoggedInUserName.subscribe( isUserLoggedIn => this.checkUsersession(isUserLoggedIn));
    // Create 100 users
    //const users = Array.from({length: 100}, (_, k) => this.createNewUser(k + 1));
    //console.log(users);
    // Assign the data to the data source for the table to render
    
  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
   // this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  ngOnInit(): void {
    this.getLiveplusChannelData(0,1000,1);
    this.getLiveplusChannelData(0,1000,3);
    this.getLiveplusChannelData(0,1000,4);
    if(localStorage.getItem('loggedInUser')) {
      this.getloggenInUser=  JSON.parse(localStorage.getItem('loggedInUser'));
      this.firstName = this.getloggenInUser.first_name;
      this.lastName = this.getloggenInUser.last_name;
      this.userEmail = this.getloggenInUser.email;
      this.isTourneyUser = this.getloggenInUser.isTourneyUser;
      this.fullname = this.firstName+' '+this.lastName;
      this.isUserLoggedIn = true;
      this.isLivePlusUser = this.getloggenInUser.isLivePlusUser;
      this.subscriptionData = this.getloggenInUser.subscriptions;
    }
  }

  private checkUsersession(isuserLoggedIn: boolean): void {
    this.isUserLoggedIn = isuserLoggedIn;
  }


   /* Start- function for get live channel videos*/
   getLiveplusChannelData(page,limit,channelId){
    this.loader = true;
    //this.tabledata = [];
    this.livePlusChannelVideosData = [];
    //this.tabledata = [];
    this.homeService.getLiveChannel(channelId,page,limit,'future').subscribe(
      response => {
        this.loader = false;
        if (response != undefined) {
         
          if(response.data != undefined && response.data.length > 0)
          {
            var channel;
            this.livePlusChannelVideosData = response.data;
            //console.log(this.livePlusChannelVideosData);
            for(var j = 0; j<this.livePlusChannelVideosData.length; j++)
            {
             
             if(channelId == 1)
             {
               channel = 'Live';
             }
             else if(channelId == 3)
             {
               channel = 'Live+';
             }
             else if(channelId == 4)
             {
               channel = 'Tourney';
             }
 
             this.tabledata.push({MATCHUP:this.livePlusChannelVideosData[j].name,TIME:moment.utc(this.livePlusChannelVideosData[j].starts_at).local().format(environment.DATE_TIME_FORMAT),CHANNEL:channel});
            }
            

            this.dataSource = new MatTableDataSource(this.tabledata);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;  
            this.changeDetectorRefs.detectChanges();
          }
          //console.log(this.tabledata,channelId);
         
        }
      },
    error => {
      this.loader = false;
      this.isSeeAll = false;
    });
    
  }
  /* End- function for get live channel videos*/

  // createNewUser(id: number): UserData {
  //   return {
  //     MATCHUP:'',
  //     TIME: '',
  //     CHANNEL:''
  //   };
  // }

}
