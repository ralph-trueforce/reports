http  = require('http');
fs    = require('fs');
url   = require('url');
mysql = require('mysql');

//TODO: optimize and put in classes

function getCurrentTimestamp() {
	return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function connect() {
	var con = mysql.createConnection({
		host:     "localhost",
		user:     "root",
		password: "123456",
		database: "reports"
	});

	con.connect(function(err) {
		if (err) {
			console.log('Error connecting to Db');
			return;
		}
		console.log('Connection established');
	});

	return con;
}

function getWidgets(con, response) {
	con.query('SELECT content FROM widget', function(err, rows) {
		if (err) {
			console.log(err);
			json = JSON.stringify({
				Result: err.code
			});
			deliver_error(json, response);
			throw err;
		}

		console.log('Data retrieved from DB:\n');
		console.log(rows);
		var widgets = [];
		for (var i = 0; i < rows.length; i++) {
			_object = JSON.parse(rows[i].content);
			widgets.push(_object);
		}
		json = JSON.stringify(widgets);
		deliver(json, response);
		return rows;
	});
	return null;
}

function fetchConfig(con, id, response) {
	con.query('SELECT content FROM widget_config WHERE id = ?', id, function(err, rows) {
		if (err) {
			console.log(err);
			json = JSON.stringify({
				Result: err.code
			});
			deliver_error(json, response);
			throw err;
		}

		console.log('Data retrieved from DB:\n');
		console.log(rows);
		var _object = {};
		for (var index = 0; index < rows.length; index++) {
			_object = JSON.parse(rows[index].content);
		}
		json = JSON.stringify(_object);
		deliver(json, response);
		return rows;
	});
	return null;
}


function widgetExists(con, widget_row, response) {
	con.query('SELECT * FROM widget WHERE id = ?',[widget_row.id], function(err, rows) {
		if (err) {
			console.log(err);
			json = JSON.stringify({
				Result: err.code
			});
			deliver_error(json, response);
			throw err;
		}
		var conn = connect();
		if (rows.length == 0) {
			console.log('[widget] New ID ' + widget_row.id);
			widget_row.description = "inserted";
			insertWidget(conn, widget_row, response);
		} else {
			console.log('[widget] ID ' + widget_row.id + ' exists.');
			widget_row.description = "updated";
			updateWidget(conn, widget_row, response);
		}
	});
}

function widgetConfigExists(con, widget_row, response) {
	con.query('SELECT * FROM widget_config WHERE id = ?',[widget_row.id], function(err, rows) {
		if (err) {
			console.log(err);
			// json = JSON.stringify({
			// 	Result: err.code
			// });
			// deliver_error(json, response);
			throw err;
		}
		var conn = connect();
		if (rows.length == 0) {
			console.log('[config] New ID ' + widget_row.id);
			insertWidgetConfig(conn, widget_row, response);
		} else {
			console.log('[config] ID ' + widget_row.id + ' exists.');
			updateWidgetConfig(conn, widget_row, response);
		}
	});
}

function widgetDataExists(con, widget_row, response) {
	con.query('SELECT * FROM widget_data WHERE id = ?',[widget_row.id], function(err, rows) {
		if (err) {
			console.log(err);
			throw err;
		}
		var conn = connect();
		if (rows.length == 0) {
			console.log('[data] New ID ' + widget_row.id);
			insertWidgetData(conn, widget_row, response);
		} else {
			console.log('[data] ID ' + widget_row.id + ' exists.');
			updateWidgetData(conn, widget_row, response);
		}
	});
}

function updateWidget(con, widget_row, response) {
	con.query('UPDATE widget SET content = ?, description = ?, modified = ? WHERE id = ?',	[widget_row.content, widget_row.description, widget_row.modified, widget_row.id],
		function (err, result) {
			if (err) {
				console.log(err);
				json = JSON.stringify({
					Result: err.code
				});
				deliver_error(json, response);
				throw err;
			}
			console.log('Changed ' + result.changedRows + ' rows');
			json = JSON.stringify({
				Result: "updated"
			});
			deliver(json, response);
		}
	);
}

function updateWidgetConfig(con, widget_row, response) {
	con.query('UPDATE widget_config SET content = ?, modified = ? WHERE id = ?', [widget_row.content, widget_row.modified, widget_row.id],
		function (err, result) {
			if (err) {
				console.log(err);
				// json = JSON.stringify({
				// 	Result: err.code
				// });
				// deliver_error(json, response);
				throw err;
			}
			console.log('Changed ' + result.changedRows + ' rows');
			// json = JSON.stringify({
			// 	Result: "updated"
			// });
			// deliver(json, response);
		}
	);
}

function updateWidgetData(con, widget_row, response) {
	con.query('UPDATE widget_data SET content = ?, modified = ? WHERE id = ?', [widget_row.content, widget_row.modified, widget_row.id],
		function (err, result) {
			if (err) {
				console.log(err);
				throw err;
			}
			console.log('Changed ' + result.changedRows + ' rows');
		}
	);
}

function insertWidget(con, widget_row, response) {
	con.query('INSERT INTO widget SET ?', widget_row, function (err, res) {
		if (err) {
			console.log(err);
			json = JSON.stringify({
				Result: err.code
			});
			deliver_error(json, response);
			throw err;
		}
		//console.log(res);
		console.log('Last inserted ID:', res.insertId);
		json = JSON.stringify({
			Result: "saved"
		});
		deliver(json, response);
	});
}

function insertWidgetConfig(con, widget_row, response) {
	con.query('INSERT INTO widget_config SET ?', widget_row, function (err, res) {
		if (err) {
			console.log(err);
			// json = JSON.stringify({
			// 	Result: err.code
			// });
			// deliver_error(json, response);
			throw err;
		}
		//console.log(res);
		console.log('[config] Last inserted ID:', res.insertId);
		// json = JSON.stringify({
		// 	Result: "saved"
		// });
		// deliver(json, response);
	});
}

function insertWidgetData(con, widget_row, response) {
	con.query('INSERT INTO widget_data SET ?', widget_row, function (err, res) {
		if (err) {
			console.log(err);
			throw err;
		}

		console.log('[data] Last inserted ID:', res.insertId);
	});
}

function saveWidget(con, widget, response) {
	var content_data = JSON.stringify(widget);

	var widget_row = {
		id:          widget.id,
		content:     content_data,
		description: "test",
		modified:    getCurrentTimestamp()
	};

	widgetExists(con, widget_row, response);
}

function saveFile(filename, content) {
	var fs = require('fs');
	fs.writeFile(filename, content, function(err) {
		if(err) {
			return console.log(err);
		}

		console.log("The file was saved!");
	});
}

function saveWidgetConfig(conn, id, config_content, response) {
	var content_data = JSON.stringify(config_content.content);

	var widget_row = {
		id:          id,
		content:     content_data,
		modified:    getCurrentTimestamp()
	};

	widgetConfigExists(conn, widget_row, response);
}

function saveWidgetData(conn, id, config_content, response) {
	var content_data = JSON.stringify(config_content.content);

	var widget_row = {
		id:          id,
		content:     content_data,
		modified:    getCurrentTimestamp()
	};

	widgetDataExists(conn, widget_row, response);
}

function removeWidget(con, widget, response) {
	con.query("DELETE FROM widget WHERE id = ?", [widget.id], function (err, result) {
		if (err) {
			console.log(err);
			json = JSON.stringify({
				Result: err.code
			});
			deliver_error(json, response);
			throw err;
		}
		console.log(widget.id + ': Deleted ' + result.affectedRows + ' rows');
		json = JSON.stringify({
			Result: "removed"
		});
		deliver(json, response);
	});
}

function close(con) {
	con.end(function(err) {
		console.log("Connection ends gracefully.");
	});
}

function handler(message, response) {
	var json;
	if (message.method == "save") {
		console.log("Saving");
		conn = connect();
		widgets = saveWidget(conn, message.param, response);
		saveWidgetConfig(conn, message.param.id, message.config, response);
		saveWidgetData(conn, message.param.id, message.data, response);
		close(conn);
	} else if (message.method == "fetch") {
		console.log("Loading");
		conn = connect();
		widgets = getWidgets(conn, response);
		close(conn);
	} else if (message.method == "remove") {
		console.log("Deleting");
		conn = connect();
		removeWidget(conn, message.param, response);
		close(conn);
	} else if (message.method == "fetch_config") {
		console.log("fetch config alone");
		conn = connect();
		fetchConfig(conn, message.param, response);
		close(conn);
	} else {
		console.log("Unknown method name " + message.method);
	}
}

function deliver(json, response) {
	client_response(json, response, 200);
}

function deliver_error(json, response) {
	client_response(json, response, 500);
}

function client_response(json, response, code) {
	//I was facing following error with code (nodejs 0.10.13), provided by ampersand: origin is not allowed by access-control-allow-origin
	response.writeHead(code, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
	console.log(json);
	response.end(json);
}

server = http.createServer( function(request, response) {
	//console.log(req);
	//console.dir(req.param);
	var path = url.parse(request.url).pathname;
	if (path == "/widget") {
		console.log("Widget service request");
		if (request.method == 'POST') {
			console.log("POST");
			var body = '';
			request.on('data', function (data) {
				body += data;
				console.log("incoming content size: " + body.length);
				console.log("Partial body: " + body);
				try {
					message = JSON.parse(body);
				} catch(e) {
					console.log(e);
					return;
				}
				handler(message, response);
			});
			// request.on('end', function () {
 			// 	 console.log("END....");
			//      console.log("Body: " + body);
			// });
			//response.setHeader('Content-Type', 'application/json');
			//res.end('post received');
		}
		else {
			console.log("GET");
			//var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
			var html = fs.readFileSync('index.html');
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.end(html);
		}
	}
	if (path == "/dashboard") {
		console.log("dashboard service request");
		if (request.method == 'POST') {
			console.log("POST");
			request.on('data', function (data) {
				console.log("Partial body: " + data);
				message = JSON.parse(data);
				handler(message, response);
			});
		}
	}
 });

 port = 3000;
 host = '127.0.0.1';
 server.listen(port, host);
 console.log('Listening at http://' + host + ':' + port);
