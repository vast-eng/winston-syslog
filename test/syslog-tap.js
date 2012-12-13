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
logger.add( 
	new (winston.transports.Syslog)({
		facility: "local1",
		level: "info"
	}),
	null, 
	true
);

logger.setLevels(winston.config.syslog.levels);

var logstring = "qwertyuiop",
	logfile = "/data/local1.log";


test("Test syslog", function(t) {

	t.ok(logger, "logger should have been created.");
	logger.info(logstring);

	exec('tail -n 1 ' + logfile, function(err, tail, stderr) {
		
		t.notOk(err, "Tail. Fail. Whale. Snail.");

		t.ok(tail.indexOf(logstring) >= 0, "Insure the logstring is in the file");

		t.end();
	});

});



