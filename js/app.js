(function(){
   var app=angular.module('infestLineup', []);
   app.filter('matchDay', [function(){
      return function(items,curDay) {
	var filtered = [];
	angular.forEach(items, function(item){
	   if(item.time.day==curDay){
		filtered.push(item);
           }
	});
	return filtered;
      };
   }]);
   app.controller('LineupController', ['$scope','$http',function($scope,$http){
     $scope.orderProp='timestamp';
     var curtab=0;
     var lineup=this;
     lineup.sets = [];
     lineup.venues = [];
     lineup.dayDeets = {};
     lineup.filterDay=function(){
 	console.log(dayCheck);
        console.log(day);
	return (dayCheck==day);
     }
     lineup.makeTimestamp=function(inTime){
	 var day, min, hour;
         var numMonth, numDay;
	 day=inTime.day;
         hour=inTime.hour;
	 min=inTime.min;
         switch(day){
	    case "Thursday":
		numMonth=6;
		numDay=31;
		break;
 	    case "Friday":
		numMonth=7;
		numDay=1;
		break;
	    case "Saturday":
		numMonth=7;
		numDay=2;
		break;
	    case "Sunday":
		numMonth=7;
		numDay=3;
		break;
	    default:
		console.log("Error reading day of week!  defaulting to SAT.");
		numMonth=7;
		numDay=2;
	  }
			
         var setTime=new Date(2014,numMonth,numDay,hour,min,0);
	 return setTime.getTime();
     };

     $http.get('json/lineup.json').success(function(data){
	console.log("getting set jsons");
        var pnum =0, startTime=0,pId="", pname={};
        lineup.sets=data;
	console.log(lineup.sets.length);
        for (; pnum < lineup.sets.length; pnum++ ){
 	   pId=lineup.sets[pnum].performerId;
           
	
           if (pId!=""){
		$http.get('json/'+pId+'.json').success((function(pnum){
		   // lineup.sets[pnum].name=data.name;
		   // lineup.sets[pnum].descriptionTags
		   return function(data){
			lineup.sets[pnum].data=data;
		   };
	        })(pnum));
                console.log(pname);
           }	
           console.log(pId);	
           startTime=lineup.makeTimestamp(lineup.sets[pnum].time);
           lineup.sets[pnum].timestamp=startTime;
	   lineup.sets[pnum].endTimestamp=startTime+lineup.sets[pnum].duration*60*1000;
        }
     });
     $http.get('json/venues.json').success(function(data){ 
	     console.log("getting venues");

        lineup.venues=data;
     });
     $http.get('json/daydeets.json').success(function(data){
     console.log("getting days");

        lineup.dayDeets=data;
        console.log(data);
     });
    
// $http.get('json/venues.json').success(function(data){
//	lineup.venues=data;
 //    });

   }]);
})();
