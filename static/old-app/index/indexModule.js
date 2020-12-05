angular.module('indexApp')
.factory('usersFactory', ['$http', function($http) {
  const usersFactory = {};

  usersFactory.abc = function() {
    console.log("abc yes");
  };

  usersFactory.register = function(config) {
    return $http.post('http://localhost:3000/register', config);
  };

  usersFactory.login = function(config) {
    return $http.get('http://localhost:3000/login', config);
  };

  usersFactory.getLoggedUserId = function() {
    return $http.get('http://localhost:3000/getLoggedUserId');
  }

  usersFactory.getUser = function() {
    return $http.get('http://localhost:3000/users/getUser');
  };

  return usersFactory;
}]);