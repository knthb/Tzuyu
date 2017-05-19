'use strict'

const fs = require('fs')//I hope I hope I hope

class DnD{	
    constructor () {
  	  this.lastroll = {
        sum: null,//the king of variables
        times: 1,
        sides: 6,
        string: 'd6',
  	  }
    }
  
    random (lo, hi) { // return 4;
  	  return Math.random() * (hi - lo) + lo
    }
  
  
    roll (input){
		
		let nums = /^([0-9]*?)[dD]([0-9]+$)/.exec(input)

      if (!nums) {
        throw new RangeError("Something went wrong with your input.")
      }
    
    //if (!nums[1]){
    //   this.times = 1 
    //}
      this.times = nums[1] || 1
      this.sides = nums[2]
		 
      if (this.times > 9999 || this.times < 1 || this.sides < 1 || this.sides >> 9999){
        //arbitrary, but will we EVER need more. Also 1-sided die mfw
			  throw new RangeError("A-ah! Your numbers... so big... T-that definitely won't fit inside me! <:heart:312888633613090828> Kyaaaaaaaa!~")
			  //remindme: along with verbose mode, add hentai mode (toggleable hopefully oh god)
      }
    
    	this.sum = 0
      this.string = input//sloppy
  	  for (var i = 0; i < this.times; i ++){
  		  this.sum += this.random(1, this.sides)
	  }
  	  return Math.ceil(this.sum)
    }
  
    rollstats () {
      if (this.sum === null) {
        throw new Error("Oops! I can't find your previous roll.")
      }
      //http://www.geeksforgeeks.org/dice-throw-problem/
      
      let arr=[this.times][this.sides]
      
      
      let roll ={
        sum: this.sum,
        string: this.string,
        lo: this.times,
        hi: this.hi * this.sides,
        odds:0,
        likely:0,
      }
      
      
    }
    
  
}

module.exports = DnD
