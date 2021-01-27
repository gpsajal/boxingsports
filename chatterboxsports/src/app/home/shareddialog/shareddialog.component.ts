declare var require:any;
import { Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
//var { analytics, api } = require('boxcast-sdk-js');
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
      //this.videoUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.shareddata.videoUrl);
      this.videoUrl = this.shareddata.videoUrl;
      console.log(this.videoUrl);
      //console.log(this.videoUrl);
    }
    //var BOXCAST_BROADCAST_ID = '777670';
    var BOXCAST_BROADCAST_ID = this.videoUrl;
      var videoContainer = document.querySelector('#js-video-container');
      var player = jwplayer('js-video');

      BoxCastSDK.api.broadcasts.get(BOXCAST_BROADCAST_ID).then(function(broadcast) {
        BoxCastSDK.api.views.get(BOXCAST_BROADCAST_ID).then(function(view) {
          if (!view.playlist) return;
          var video = player.setup({
            file: view.playlist,
            controls: true,
            stretching: 'fill',
            height: '100%',
            width: '100%'
          });
          video.on('ready', function() {
            BoxCastSDK.analytics.mode('html5').attach({
              video: videoContainer.querySelector('video'),
              broadcast: broadcast,
              channel_id: broadcast.channel_id
            });
          });
        });
      });


    // var BOXCAST_BROADCAST_ID = 'uebrsxhvyrszq5n5bwcf';
    //   var videoContainer = document.querySelector('#js-video-container');
    //   var player = videojs('js-video');

    //   BoxCastSDK.api.broadcasts.get(BOXCAST_BROADCAST_ID).then(function(broadcast) {
    //     BoxCastSDK.api.views.get(BOXCAST_BROADCAST_ID).then(function(view) {
    //       if (!view.playlist) return;
    //       player.src(view.playlist);
    //       BoxCastSDK.analytics.mode('video.js').attach({
    //         player: player,
    //         broadcast: broadcast,
    //         channel_id: broadcast.channel_id
    //       });
    //     });
    //   });
  }


  closeDialog()
  {
    this.dialog.closeAll();
  }
}
