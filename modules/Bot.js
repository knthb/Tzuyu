'use strict'

const ytdl = require('ytdl-core')
const Queue = require('./Queue')
const Discord = require('discord.js')
const Song = require('./media/Song')
const Playlist = require('./media/Playlist')
const DnD = require('./DnD')//experimental
const Helper = require('./Helper')//Experimentaler
// const MediaPlayer = require('./MediaPlayer');

class Bot {
  constructor () {
    this.streamOptions = {
      seek: 0,
      volume: 0.1
    }
    this.voice = {
      channel: null
    }
    this.text = {
      channel: null
    }
    this.connection = null
    this.queue = new Queue()
    this.dispatcher = null
    this.client = new Discord.Client()
	this.DM = new DnD()//PRAY
	this.help = new Helper()//C H R I S T
    this.config = {
      prefix: '!',
      messageDelay: 15000,
	  local: false
	  //uhh
    }
    this.isConnecting = false

    this.permlist = {
      users: [116399321661833218, 304780284077801472],
      isActive: true,
      type: 'blacklist'
    }
    this.currentSong = {
      'title': '',
      'url': ''
    }
    // this.mediaPlayer = new MediaPlayer();
  }

  addToPermlist (id) {
    this.permlist.users.push(id)
  }

  isLocal (){
	  return this.local;
  }
	
  isPermitted (id) {
    if (this.permlist.isActive) {
      if (this.permlist.type === 'whitelist') {
        return this.permlist.users.includes(id)
      } else {
        return !this.permlist.users.includes(id)
      }
    } else {
      return true
    }
  }
  setPermlistStatus (status) {
    this.permlist.type = status
  }

  join (id) {
    if (!this.voice.connection) {
      this.isConnecting = true
      if (!id) {
        return this.voice.channel.join()
      } else {
        this.voice.channel = this.client.channels.get(id)
        return this.voice.channel.join()
      }
    }
  }

  leave () {
    this.queue.dumpQ()
    if (this.dispatcher) {
      this.dispatcher.end()
    }
    if (this.connection) {
      this.voice.channel.leave()
      this.connection = null
    } else {
      // check to see if it died
      const conns = this.client.voiceConnections.array()
      // console.log(conns);
      if (conns.length > 0) {
        for (var i = conns.length - 1; i >= 0; i--) {
          conns[i].leave()
        };
      }
    }
    this.setPlaying('Overwatch') // well...
  }
  _playAfterLoad () {
    // assumes we are connected to voice and plays the top of the queue or whatever is specified
    // console.log(this.voice.channel.members);

    var stream = null
    // no url provided, just play from queue
    if (this.queue.isEmpty()) {
      this.message('Queue is empty, leaving...')
      return this.leave()
    }

    let next = this.queue.dequeue()
    let url = next.url
    let title = next.title
    // console.log(next);

    this.currentSong = next
    this.message('Now playing: **' + title + '**')
    this.setPlaying(title)

    stream = ytdl(url, {filter: 'audioonly', quality: 'lowest'})

    console.log('playing' + url)

    try {
      this.dispatcher = this.connection.playStream(stream, this.streamOptions)

      // bind a callback to do something when the song ends
      this.dispatcher.on('end', () => {
        this.dispatcher = null
        if (this.queue.isEmpty()) {
          this.message('Queue is empty, leaving...')
          return this.leave()
        } else {
          this._playAfterLoad()
        }
      })
    } catch (e) {
      console.error(e)
      this.message('Something happened')
      this.leave()
    }
  }
  message (m, callback) {
    this.text.channel.send(m).then(message => {
      if (typeof callback === 'function') {
        callback()
      }
      message.delete(this.config.messageDelay)
    }).catch(console.error)
  }

  _ensureConnectionAfterRequest () {
    if (!this.connection && !this.isConnecting) {
      console.log('No connection, connecting...')

      this.join().then(conn => {
        this.isConnecting = false
        this.connection = conn
        this._playAfterLoad()
      }).catch(e => {
        console.error(e)
        this.leave()
      })
    } else {
      // var latest = this.queue.peekLast()
      // do something...
    }
  }

  // make sure you only send this boy a song object
  _queue (item) {
    if (item instanceof Playlist) {
      this.message('Adding playlist to queue...')
      this.queue.concat(item.unwrap())
    } else if (item instanceof Song) {
      this.message('Added ' + item.getTitle() + ' to queue at position ' + parseInt(this.queue.getLength() + 1))
      this.queue.enqueue(item)
    }
    this._ensureConnectionAfterRequest()
  }

  play (input) {
    if (input instanceof Song || input instanceof Playlist) {
      this._queue(input)
    } else {
      throw new TypeError('Item passed to play was an instance of ' + input.constructor.name)
    }
  }
  stop () {
    if (this.dispatcher) {
      this.dispatcher.end()
    }
    this.leave()
  }
  skip () {
    if (this.dispatcher) {
      this.dispatcher.end()
    }
  }
  listQ () {
    var output = ''

    if (this.queue.isEmpty()) {
      return this.message('Queue is empty')
    }
    var q = this.queue.returnQ()

    for (var j = 0; j < Math.ceil((q.length) / 25); j++) {
      for (let i = j * 25; i < (j * 25) + 25; i++) {
        if (!q[i]) { break }

        output += (i + 1).toString() + '. **' + q[i].getTitle() + '**\n'
      }
      this.message(output)
      output = ''
    }
  }
  bump (songIndex) {
    if (!isNaN(parseInt(songIndex))) {
      let res = this.queue.bump(parseInt(songIndex))
      if (typeof res === 'object' && res[0]) {
        this.message('Bumped ' + res[0].getTitle() + ' to front of queue')
      } else {
        this.message('No song found at index `' + songIndex + '`')
      }
    }
  }
  removeFromQueue (songIndex) {
    if (!isNaN(parseInt(songIndex))) {
      let t = this.queue.removeFromQueue(parseInt(songIndex))
      if (typeof t === 'object' && t[0]) {
        this.message('Removed ' + t[0].getTitle() + ' from queue')
      } else {
        this.message('No song found at index ' + songIndex)
      }
    }
  }
  shuffle () {
    this.queue.shuffle()
  }
  setPlaying (status) {
    this.client.user.setGame(status)
  }
  setStatus (status) {
    this.client.user.setStatus(status)
  }
  setVoiceChannel (chanID) {
    this.voice.channel = this.client.channels.get(chanID)
  }
  setTextChannel (chanID) {
    this.text.channel = this.client.channels.get(chanID)
  }
  setPrefix (pfx) {
    this.config.prefix = pfx
  }
  getPrefix () {
    return this.config.prefix
  }
  setMessageDeleteDelay (i) {
    if (!isNaN(parseInt(i))) {
      this.config.messageDelay = parseInt(i)
      return true
    }
    return false
  }
  login (token) {
    this.client.login(token)
  }
  
  roll(input){
    try{
	    let result = this.DM.roll(input)
      this.message(input+' rolled: **'+result+'**')
      //insert helper errorhandler
    }catch(e){
      		this.message(e.message+" Try using `"+this.getPrefix()+"help roll` for more info.")
      //temporary, until the global helper
    }
  }
  
  lastroll(){
    try{
        let last = this.DM.rollstats()
        this.message("```Last roll: "+last.string+"\nYou rolled: "+last.sum+"\nChances of this outcome: "+last.odds+"```")
      }catch(e){
        console.log(e)
      this.message(e.message+" Try using `"+this.getPrefix()+"help rollstats` for more info.")
      //insert errorhandler
    }
  
  }
}

module.exports = Bot
