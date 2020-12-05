angular.module('mainApp')
.factory('mainFactory', ['$http', function($http) {
  let mainFactory = {};

  mainFactory.getTasksOfDay = function(date, userId) {
    return $http.get('http://localhost:3000/main/getTasksOfDay', {params: {date: date, userId: userId}});
  };
  
  mainFactory.addTask = function(data) {
    console.log(data);
    return $http.post('http://localhost:3000/main/addTask', data);
  };

  mainFactory.updateTask = function(updatedTask) {
    return $http.post('http://localhost:3000/main/updateTask', updatedTask);
  };

  mainFactory.deleteTask = function(taskId) {
    return $http.post('http://localhost:3000/main/deleteTask', {id: taskId});
  };

  mainFactory.changeGroupBy = function(userId, groupBy) {
    return $http.post('http://localhost:3000/main/changeGroupBy', {id: userId, update: {groupBy}});
  };

  mainFactory.logOut = function() {
    return $http.post('http://localhost:3000/logout');
  };

  return mainFactory;
}]);