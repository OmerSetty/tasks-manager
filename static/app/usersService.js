mainApp
.service('usersService', function($http) {

  this.getLoggedUserId = function() {
    return $http.get('http://localhost:3000/getLoggedUserId');
  };

}
);