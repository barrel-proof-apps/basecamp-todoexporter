var config = require("./config");
var Client = require('node-rest-client').Client;
var when = require("when");
var _ = require("underscore")
var csv  = require("fast-csv")

var options_auth={user:config.username,password:config.password};

client = new Client(options_auth)
var parseArgs = require('minimist')(process.argv.slice(2));

var projectId = parseArgs.projectId ? parseArgs.projectId : config.projectId
var accountId = parseArgs.accountId ? parseArgs.accountId : config.accountId

var prefix = "https://basecamp.com/" + accountId + "/api/v1";
var toUrl = function(snippet) {
	return prefix + snippet
}
var toUserUrl = function(snippet) {
	return "https://basecamp.com/" + accountId + "/projects/" +projectId + snippet
}
var args = {
	headers: {
		'User-Agent': 'Myapp (http://barrelproofapps.com)'
	}
};
var helper = module.exports = {
	projects: function() {
		return when.promise(function(resolve, reject, notify) {
			client.get(toUrl("/projects.json"), args,function(data, response){
				var obj = JSON.parse(data)
				resolve(obj)
			})
		});
	},
	todoLists:function(projectId){
		return when.promise(function(resolve, reject, notify) {
			client.get(toUrl("/projects/"+projectId + "/todolists.json"), args,function(data, response){
				var obj = JSON.parse(data)
				resolve(obj)
			})
		});
	},
	todos:function(projectId, todoListId){
		return when.promise(function(resolve, reject, notify) {
			client.get(toUrl("/projects/"+projectId + "/todolists/" + todoListId + "/todos.json"), args,function(data, response){
				var obj = JSON.parse(data)
				resolve(obj)
			})
		});
	}
}

// helper.projects().then(function(data){
// 	console.log("data: " + data[0].id)
// })
helper.todoLists(projectId).then(function(data){
	var filtered = _.filter(data, function(list){
		return list.name.indexOf("Theme: ") == 0
	})
	var todos = _.map(filtered, function(todoList){
		return helper.todos(projectId, todoList.id).then(function(todos){
			return todos
		})
	})
	when.all(todos).then(function(todos){
		todos = _.flatten(todos, true)
		var csvStream = csv.format({headers: true});
		csvStream.pipe( process.stdout);
		_.each(todos, function(todo){
			csvStream.write({
				theme: todo.todolist.name,
				story: todo.content,
				todoUrl: toUserUrl("/todos/" + todo.id)
			});
		})
		csvStream.end()
	})
})