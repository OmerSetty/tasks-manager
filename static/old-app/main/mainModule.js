angular.module('mainApp')
.factory('tasksFactory', ['$http', function($http) {
  let tasksFactory = {};

  tasksFactory.getTasksOfDay = function(date) {
    return $http.get('http://localhost:3000/main/getTasksOfDay', {params: {date: date}});
  };
  
  tasksFactory.addTask = function(data) {
    return $http.post('http://localhost:3000/main/addTask', data);
  };

  tasksFactory.updateTask = function(updatedTasks) {
    return $http.post('http://localhost:3000/main/updateTask', updatedTasks);
  };

  tasksFactory.deleteTask = function(data) {
    return $http.post('http://localhost:3000/main/deleteTask', {id: data});
  };

  tasksFactory.logOut = function() {
    return $http.post('http://localhost:3000/logout');
  };

  return tasksFactory;
}]);