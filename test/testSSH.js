var KnowhowShell = require('../knowhow-shell.js');
var knowhowShell = new KnowhowShell();
var assert = require('assert');

sshJob = { 
  "id": "example ssh interactive shell",
  "working_dir": ".",
  "shell": {
  	"command": "ssh",
  	"args": [
  		"${agent_user}@${HOST}"
  	],
  	"onConnect" : {
	  	"responses": {
	  		"[pP]assword": "${agent_password}",
  			"passphrase": "knowhow"
	  	},
  		"waitForPrompt" : "[$]"
  	},
  	"onExit" : {
  		"command": "exit"
  	}
  },
  "options": {
    "timeoutms": 10000
  },
  "env": {
  	"agent_user": "johnfelten",
  	"HOST": "localhost",
  	agent_password: ""
  },
  "files": [],
  "script": {
		"env": {
	  		"USER123": "${agent_user}",
  			"TEST_DIR": "${working_dir}/test"
		},
		commands: [
			{	
				"command": "echo $TEST_DIR"
			},
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

try {
	knowhowShell.executeJob(sshJob, function(err) {
		assert.ifError(err);
		process.exit(0);
	});
} catch (err) {
	console.log(err.message);
	console.log(err.stack);
}
