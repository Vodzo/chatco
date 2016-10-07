(function() {
	angular.module('chatco', [
		'login'
	])
})();
(function() {

	var login_module = angular.module('login', []);

	login_module.controller('LoginController', function() {
		this.user = {};

		this.submit = function(user) {
			this.user.name = user.username;
			this.user.password = user.password;
		}

	});

})();