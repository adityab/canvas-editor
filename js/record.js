var Record = {
	
	handlers: {},
	
	record: function() {
		if ( !Record.recording ) {
			Record.stopPlayback();
			
			Record.commands = [];
			Record.recording = true;
			Record.startTime = (new Date).getTime();
			
			$(Record).trigger( "recordStarted" );
		}
	},
	
	stopRecord: function() {
		if ( Record.recording ) {
			Record.recording = false;
		
			$(Record).trigger( "recordEnded" );
		}
	},
	
	seekTo: function( time ) {
		Record.seeking = true;
		Record.pausePlayback();
		
		Editor.reset();
		Canvas.clear( true );
		Canvas.endDraw();
		
		var i = 0;
		
		var interval = setInterval(function() {
			var evt = Record.commands[ i ];
			
			if ( evt.time > time ) {
				Record.pauseTime = (new Date).getTime();
				Record.playStart = Record.pauseTime - time;
				Record.playPos = i;
				
				clearInterval( interval );
				Record.seeking = false;
				
			} else {
				Record.runCommand( evt );
			}

			if ( ++i === Record.commands.length ) {
				clearInterval( interval );
				Record.seeking = false;
			}
		}, 1 );
	},
	
	play: function() {
		// Don't play if we're already playing
		if ( Record.playing || !Record.commands ) {
			return;
		}
		
		Record.stopRecord();
		
		Record.playing = true;
		Record.playPos = Record.playPos || 0;
		Record.playStart = (new Date).getTime() -
			(Record.playStart ? Record.pauseTime - Record.playStart : 0);

		Record.playInterval = setInterval(function() {
			var evt = Record.commands[ Record.playPos ];

			if ( evt && Record.currentTime() >= evt.time ) {
				Record.runCommand( evt );

				if ( ++Record.playPos === Record.commands.length ) {
					Record.stopPlayback();

					$(Record).trigger( "playEnded" );
				}
			}
		}, 1 );
		
		$(Record).trigger( "playStarted", !!Record.pauseTime );
	},
	
	pausePlayback: function() {
		if ( Record.playing ) {
			clearInterval( Record.playInterval );
		
			Record.playing = false;
			Record.playInterval = null;
			Record.pauseTime = (new Date).getTime();
			
			$(Record).trigger( "playStopped" );
		}
	},
	
	stopPlayback: function() {
		if ( Record.playing ) {
			Record.pausePlayback();
		
			Record.playPos = null;
			Record.playStart = null;
		}
	},
	
	currentTime: function() {
		return (new Date).getTime() - Record.playStart;
	},

	runCommand: function( evt ) {
		for ( var handler in Record.handlers ) {
			if ( typeof evt[ handler ] !== "undefined" ) {
				return Record.handlers[ handler ]( evt );
			}
		}
	},

	log: function( e ) {
		if ( !Record.playing && Record.recording ) {
			e.time = (new Date).getTime() - Record.startTime;
			Record.commands.push( e );
			return true;
		}
	}
};