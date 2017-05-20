'use strict'

const fs = require('fs')//I hope I hope I hope

class DnD{	
    constructor () {
  	  this.lastroll = {
        sum: undefined,//the king of variables
        times: 1,
        sides: 6,
        string: 'd6',
  	  }
    }
  
    random (lo, hi) { // return 4;
  	  return Math.round(Math.random() * (hi - lo) + lo)
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
      if (this.sum === undefined) {
        throw new Error("Oops! I can't find your previous roll.")
      }
      console.log(this.sum)
      //http://www.geeksforgeeks.org/dice-throw-problem/
      
      let x = this.sum
      let n = this.times
      let m = this.sides
      console.log('x='+x+' n='+n+' m='+m)

      
      
      var arr = [n + 1][x + 1]
      arr.fill(0)
      
      console.log(arr[1][x])
      
      for (var i = 1; i <= m && i <= x; i++){
          arr[1][i] = 1
      }
      
      for (let i = 2; i <= n; i++) {
        for (let j = 1; j <= x; j++) {
          for (let k = 1; k <= m && k < j; k++) {
            arr[i][j] += (arr[i-1][j-k] || 0)
          }
        }
      }

      console.log ('Chances are '+ arr[n][x] +' in '+(n*m))
            this.odds = arr[n][x] / (n*m)
      
      let roll ={
        sum: this.sum,
        string: this.string,
        lo: this.times,
        hi: this.hi * this.sides,
        odds:this.odds,
        likely:0,
      }
      
      
    }
    
  
}

module.exports = DnD
