var winston = require('winston'),
	mixdownLogger = require('../lib/winston-syslog'),
	exec = require('child_process').exec,
	tap = require('tap'),
	test = tap.test;
/**
* To run this test, setup a log transport locally.  Instructions here: http://vastdevblog.vast.com/blog/2012/04/18/using-syslogappender-on-os-x/
* Set up the local1 facility and point it at a file 
**/

var logger = new (winston.Logger)();
var soptions = {
		facility: "local1",
		level: "info",
		app_name: "foo"
	};

logger.add( 
	new (winston.transports.Syslog)(soptions),
	null, 
	true
);

logger.setLevels(winston.config.syslog.levels);

var logstring = "qwertyuiop",
	logfile = "/data/local1.log";


test("Test syslog info", function(t) {

	t.ok(logger, "logger should have been created.");
	logger.info(logstring);
	// console.log(logstring);

	exec('tail -n 1 ' + logfile, function(err, tail, stderr) {
		
		t.notOk(err, "Tail. Fail. Whale. Female. Snail.");

		t.ok(tail.indexOf(logstring) >= 0, "Ensure the logstring is in the entry");
		t.ok(tail.indexOf(soptions.app_name) >= 0, "Ensure the app_name is in the entry");

		t.end();
	});

});
