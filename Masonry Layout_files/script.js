'use strict';

(function () {

	/**
	 * cheng internal api
	 * @return {obj} expose api(s)
	 */
	function cheng () {
		var modules = [];
		function module (name, modulesNameList) {
			var m = new Module(name);
			for (var i = 0, moduleName; moduleName = modulesNameList[i]; i++) {
				for (var j = 0; module = modules[j]; j++) {
					if (moduleName == module.getName()) {
						m.mergeServices(module.getServices());
					}
				}
			}
			modules.push(m);
			return m;
		}
		return {
			module : module
		};
	}


	/**
	 * Module constructor
	 * @param {string} 	name  Module's name
	 */
	function Module (name) {
		this.name = name;
		var services = [];
	}

	Module.prototype.name = '';
	Module.prototype.getName = function () {
		return this.name;
	}
	Module.prototype.factory = function (name, servicesNameList, callback) {
		var toBeInjectedServices = [];
		var service = new Service(name, servicesNameList, callback);
		for (var i = 0, serviceName; serviceName = servicesNameList[0]; i++) {
			for (var j = 0, service; service = services[j]; j++) {
				if (serviceName == service.getName()) {
					toBeInjectedServices.push(service);
				}
			}
		}
		services.push(service);
	}
	Module.prototype.getServices = function () {
		return this.services;
	}
	Module.prototype.mergeServices = function (servicesList) {
		this.services.concat(servicesList);
	}


	/**
	 * Service constructor
	 * @param {string}   name          Service's name
	 * @param {array}    dependencies  List of services dependencies
	 * @param {function} callback      Service's callback
	 */
	function Service (name, servicesNameList, callback) {
		this.name = name;
		this.dependencies = servicesNameList;
		this.callback = callback;
	}
	Service.prototype.name = '';
	Service.prototype.getName = function () {
		return this.name;
	}
	Service.prototype.dependencies = [];
	Service.prototype.callback = null;


	// expose cheng global object
	window.cheng = cheng();

})();



var a = cheng.module('aModule', []);

a.factory('roar', [], function () {
	console.log('i am roaring');
});

var b = cheng.module('bModule', ['aModule']);


console.log(a);

console.log(b);
