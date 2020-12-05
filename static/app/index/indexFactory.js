angular.module('mainApp')
.factory('indexFactory', ['$http', function($http) {
  const indexFactory = {};

  indexFactory.register = function(config) {
    return $http.post('http://localhost:3000/register', config);
  };

  indexFactory.login = function(config) {
    return $http.get('http://localhost:3000/login', config);
  };

  indexFactory.getLoggedUserId = function() {
    return $http.get('http://localhost:3000/getLoggedUserId');
  }

  return indexFactory;
}]);