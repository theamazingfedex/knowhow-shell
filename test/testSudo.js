var KnowhowShell = require('../knowhow-shell.js');
var knowhowShell = new KnowhowShell();
var assert = require('assert');

sudoJob = { 
  "id": "example ssh interactive shell",
  "working_dir": "./",
  "shell": {
  	"command": "sudo su - ${SUDO_USER}",
  	"onConnect" : {
	  	"responses": {
	  		"[Pp]assword": "${PASSWORD}"
	  	},
	  	"errorConditions" : ["Sorry","[Dd]enied"],
  		"waitForPrompt" : "[$]"
  	},
  	"onExit" : {
  		"command": "exit"
  	}
  },
  "options": {
    "timeoutms": 3600
  },
  "files": [],
	script: {
		"env": {
      		SUDO_USER: 'vip',
      		PASSWORD: 'password'
    	},
		commands: [

			{
				command: 'ls'
			},
			{
				command: 'pwd'
			}
		] 
	}
};

knowhowShell.on('execution-complete', function(command) {
	console.log('Execution complete:');
	console.log('\tcommand: '+command.command);
	console.log('\tret code: '+command.returnCode);
	console.log('\toutput: '+command.output);
	console.log('\n');
});

knowhowShell.on('execution-error', function(command) {
	console.log('Execution error:');
	console.log('\tcommand: '+command.command);
	console.log('\tret code: '+command.returnCode);
	console.log('\toutput: '+command.output);
	console.log('\n');
});

knowhowShell.on('job-complete', function(job) {
	console.log(job.id+' complete!');
});

knowhowShell.on('job-error', function(job) {
	console.log(job.id+' error!');
});

knowhowShell.on('job-update', function(job) {
	console.log(job.id +' progress = '+job.progress);
});


knowhowShell.executeJob(sudoJob, function(err) {
	assert.ifError(err);
});
