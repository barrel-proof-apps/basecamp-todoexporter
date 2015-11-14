var Client = require('node-rest-client').Client;
var when = require("when");
var _ = require("underscore")
var csv  = require("fast-csv")

module.exports = function(config){
	return {
		config:config,
		_toUrl: function(snippet) {
			return "https://basecamp.com/" + this.config.accountId + "/api/v1" + snippet;
		},
		_toUserUrl: function(snippet) {
			return "https://basecamp.com/" + this.config.accountId + "/projects/" +this.config.projectId + snippet
		},
		_client: function() {
			if (!this.__client) {
				this.__client = new Client({user:this.config.username,password:this.config.password})
			}
			return this.__client;
		},
		_args:function() {
			return {
				headers: {
					'User-Agent': this.config.userAgent
				}
			}
		},
		projects: function() {
			var self = this;
			return when.promise(function(resolve, reject, notify) {
				self._client().get(self._toUrl("/projects.json"), self._args(),function(data, response){
					resolve(JSON.parse(data))
				})
			});
		},
		todoLists:function(projectId){
			var self = this;
			return when.promise(function(resolve, reject, notify) {
				self._client().get(self._toUrl("/projects/"+projectId + "/todolists.json"), self._args(),function(data, response){
					var obj = JSON.parse(data)
					resolve(obj)
				})
			});
		},
		todos:function(projectId, todoListId){
			var self = this;
			return when.promise(function(resolve, reject, notify) {
				self._client().get(self._toUrl("/projects/"+projectId + "/todolists/" + todoListId + "/todos.json"), self._args(),function(data, response){
					var obj = JSON.parse(data)
					resolve(obj)
				})
			});
		},
		createCsv:function(projectId){
			var self = this;
			self.todoLists(projectId).then(function(data){
				var todos = _.map(data, function(todoList){
					return self.todos(projectId, todoList.id).then(function(todos){
						return todos;
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
							todoUrl: self._toUserUrl("/todos/" + todo.id)
						});
					})
					csvStream.end()
				})
			})
		}
	};
}

