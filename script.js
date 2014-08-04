'use strict';

(function () {

	/**
	 * cheng internal api
	 * @return {obj} expose api(s)
	 */
	function cheng () {
		var modules = [];
		var queues = [];
		function mergeServicesFromRequiredModules (m, modules, modulesNameList) {
			for (var i = 0, moduleName; moduleName = modulesNameList[i]; i++) {
				for (var j = 0; module = modules[j]; j++) {
					if (moduleName == module.getName()) {
						m.mergeServices(module.getServices());
					}
				}
			}
			return m;
		}
		function module (name, modulesNameList) {
			var m = new Module(name, modulesNameList);
			queues.push(function () {
				mergeServicesFromRequiredModules(m, modules, modulesNameList);
			});
			modules.push(m);
			return m;
		}
		function controller (name, servicesNameList, callback) {

		}
		function runQueues () {
			for (var i = 0, queue; queue = queues[i]; i++) {
				queue();
			}
		}

		return {
			module : module,
			runQueues : runQueues
		};
	}


	/**
	 * Module constructor
	 * @param {string} 	name  Module's name
	 */
	function Module (name, modulesNameList) {
		var name = name;
		var modulesNameList = modulesNameList;
		var services = [];

		this.getName = function () {
			return name;
		}
		this.getModulesNameList = function () {
			return modulesNameList;
		}
		function getToBeInjectedServices (services, servicesNameList) {
			var toBeInjectedServices = [];
			for (var i = 0, serviceName; serviceName = servicesNameList[0]; i++) {
				for (var j = 0, service; service = services[j]; j++) {
					if (serviceName == service.getName()) {
						toBeInjectedServices.push(service.getApis());
					}
				}
			}
			return toBeInjectedServices;
		}
		this.factory = function (name, servicesNameList, callback) {
			var service = new Service(name, servicesNameList);
			var toBeInjectedServices = getToBeInjectedServices(services, servicesNameList);
			var apis = callback.apply(null, toBeInjectedServices);
			service.setApis(apis);
			services.push(service);
		}
		this.getServices = function () {
			return services;
		}
		this.mergeServices = function (servicesList) {
			services = services.concat(servicesList);
		}
	}


	/**
	 * Service constructor
	 * @param {string}   name          Service's name
	 * @param {array}    dependencies  List of services dependencies
	 * @param {function} callback      Service's callback
	 */
	function Service (name, servicesNameList) {
		var name = name;
		var dependencies = servicesNameList;
		var apis;

		this.getName = function () {
			return name;
		}
		this.setApis = function (apis) {
			apis = apis;
		}
		this.getApis = function () {
			return apis;
		}
	}


	// expose cheng global object
	window.cheng = cheng();


})();


var c = cheng.module('cModule', ['aModule', 'bModule']);


var a = cheng.module('aModule', ['bModule']);
a.factory('gii', [], function () {

	return {
		a : 1
	}

});

a.factory('roar', [], function () {
	function roar () {
		console.log('i am roaring');
	}
	function miao () {
		console.log('miaoing');
	}
	return {
		roar: roar,
		miao: miao
	};
});

var b = cheng.module('bModule', ['aModule']);

b.factory('baba', [], function () {
	function babane () {
		console.log('babane');
	}

	return {
		babane : babane
	}
});



cheng.runQueues();