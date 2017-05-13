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
		var times = 1
		var sides = 6
			  
		if (input === undefined){ //if some idiot just didn't add something to it
						console.log('primitiveCheck')
			return -1
		}
		
  	  var nums = input.toString().split('d' || 'D', 2);
	  
	  if(nums[0] != undefined && !isNaN(nums[0])){
		  times = nums[0]
		  console.log('1 - '+nums[0])
		  console.log('2 - '+nums[1])
	  }	  
	  
	  
	  
	  var sides = nums[1];
	  
  	 // if (!input[1] || isNaN(input[0]) || isNaN(input[1])){
		 
		 if (isNaN(nums[0]) || isNaN(nums[1]) || nums[1] == undefined){
		 	return -1

		 }
		 if (nums[0] > 10000 || nums [1] > 10000 || nums[0] < 0 || nums[1] < 0){
			 //I'm not sure who would roll 10 000 1-sided die, rather than a 10 000-sided die, but hey your game not mine man
		 	return -2
		 }
		 
	  
  	  for (var i = 0; i < times; i ++){
  		  sum += this.random(1, sides)
	  }
	  
	  
  	  return Math.ceil(sum);
    }
  
    //rollstats (input){
  	  //}
  
}

module.exports = DnD
