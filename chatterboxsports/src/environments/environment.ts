// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  SITE_URL:"http://localhost:4200/",
  //BASE_URL:"http://localhost:2020/users/",
  //BASE_URL:"http://ec2-18-219-16-136.us-east-2.compute.amazonaws.com:5050/users/",
  BASE_URL:"http://ec2-3-137-98-252.us-east-2.compute.amazonaws.com:8000/app/",
  BOXCAST_VIEWER_URL:"https://boxcast.tv/view/",
  DATE_TIME_FORMAT:'MMM D, YYYY h:mm A',
  UPCOMING_DATE_TIME_FORMAT:'MMM D, h:mm A',
  DATE_FORMAT:'MMM D, YYYY',
  //livePlusPriceId:"price_1IJN5LGV54ADk0vhkwrBVCVf",
  //tourneyPriceId:"price_1IKMqlGV54ADk0vhjiM5uStS"
  livePlusPriceId:"price_1GsaIoF3iSRZyQvHHatVli91",
  tourneyPriceId:"price_1Gscr9F3iSRZyQvHakwMRk4D",
  stripe_publish_key:"pk_test_a1zNrEXYzWw45x23wNlxIzTO00iMOfyZ0P"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
