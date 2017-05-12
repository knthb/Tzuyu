'use strict'

const fs = require('fs')//I hope I hope I hope

class DnD{	
    constructor () {
  	  this.lastroll = {
  		  result: 0,
  		  hi: 0,
  		  lo: 0
  	  }
    }
  
    random (lo, hi) { // return 4;
  	  return Math.random() * (hi - lo) + lo;
    }
  
    roll (input){
		var sum = 0;//the king of variables
			  
		if (!input){
			sum = -1
		}
		
  	  var nums = input.split('d');
	  //set times to roll
	  var times = 1;
	  
	  
  	  if (!input[1] || isNaN(input[0]) || isNaN(input[1])){
  		  return -1;//this'll catch invalid stuff
  	  }
  	  if(nums[0]){
  		  times = 1;
  	  }
	  
	  
  	  var sides = nums[1];


	  
  	  for (var cnt = 0; cnt < times; cnt++){
  		  sum += this.random(1, sides);
	  }
  	  return Math.ceil(sum);
    }
  
    //rollstats (input){
  	  //}
  
}

module.exports = DnD
