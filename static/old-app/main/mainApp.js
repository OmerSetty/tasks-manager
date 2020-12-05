 

mainApp.controller('mainController', ['$scope', '$window', '$mdSidenav', '$mdDialog', 'tasksFactory', mainController]);
function mainController($scope, $window, $mdSidenav, $mdDialog, tasksFactory) {
  

  $scope.COLORS = ['blue', 'black', 'orange', 'green', 'grey', 'purple', 'red'];
  $scope.tasksAmount = (length) => {
    return length == 1 ? `${length} task` : `${length} tasks`;
  };
  
  const shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  };

  shuffleArray($scope.COLORS);

  $scope.openLeftMenu = () => {
    $mdSidenav('left').toggle();
  };

  const orderNewTasks = (newTasksObj) =>  {
    // adding the group key to the object
    const addedKey = Object.keys(newTasksObj);
    newTasksObj[addedKey][$scope.groupBy] = addedKey[0];

    // removing the empty fields (fields in which the user
    // wrote and left empty),
    // and converting the deadline to format of hour only (hh:mm)
    for (key in newTasksObj[addedKey]) {
      if (newTasksObj[addedKey][key] == '') delete newTasksObj[addedKey][key];
      if (key == 'deadline') newTasksObj[addedKey][key] = $scope.toTime(newTasksObj[addedKey][key]);
    }
    return newTasksObj[addedKey];
  };

  $scope.date = '03.08';

  $scope.getTasksOfDay = function() {
    tasksFactory.getTasksOfDay($scope.date)
    .then((result) => {
      $scope.tasksOfDay = result.data.tasks;
      console.log($scope.tasksOfDay);
      if ($scope.tasksOfDay.length == 0) {
        $scope.tasksOfDay.push({
          category: 'No Category',
          hide: true
        });
      };
      $scope.values = result.data.values[0];
      $scope.filterList = $scope.reArrangeList($scope.values, ['assignee', 'status']);
      $scope.groupList = $scope.reArrangeList($scope.values, ['category', 'prioritiy']);
    })
    .catch((err) => {
      console.log(err);
    });
  };
  $scope.getTasksOfDay();

  // re-arranging list by filtering by specific keys
  $scope.reArrangeList = function(list, keys) {
    return Object.keys(list)
    .filter(key => keys.includes(key))
    .reduce((obj, key) => {
      obj[key] = list[key];
      return obj;
    }, {});
  };

  $scope.filterBy = {};
  $scope.filterByText = '';
  $scope.groupBy = 'category';
  $scope.dynamicField = $scope.groupBy == 'category' ? 'priority' : 'category';

  // setting the text which displays in the select filter element
  $scope.filterText = function() {
    return angular.equals($scope.filterBy, {}) ? 'Filter By: ': `Filter by: ${$scope.filterBy.field} - ${$scope.filterBy.value}`;
  };

  // setting the dynamic field to be contrary to the groupBy parameter
  $scope.groupField = function() {
    $scope.dynamicField = $scope.groupBy == 'category' ? 'priority' : 'category';
  };

  $scope.filteredTasks = {};
  $scope.filteredGroups = [];


  
  // if no filter was defined - don't filter, otherwise - filter
  $scope.setTaskFilter = (task) => {
    return angular.equals($scope.filterBy, {}) ? true : task[$scope.filterBy.field] == $scope.filterBy.value;
  };

  $scope.setGroupFilter = (filteredTasks) => {
    console.log(filteredTasks.length);
    console.log(filteredTasks.length > 0);
    return true;
  };


  // adding the 'all' key to every task object, so the 'groupBy' could group all of the tasks
  const addAll = function() {
    $scope.tasksOfDay.forEach(task => {
        task['all'] = 'All Tasks';
      });
  };
  
  $scope.showAllTasks = () => {
    $scope.groupBy = 'all';
    addAll();
  };

  $scope.doTask = function(task) {
    task.done = !task.done;;
    task.status = task.done ? "done" : "in progress";
    $scope.updateTask(task, 'status');
  };

  $scope.doneClass = function(task) {
    return task.status == 'done' ? 'rgb(191 190 188)' : 'white';
  };

  $scope.newTasks = {};
  $scope.updatedTasks = {};

  $scope.enterPressed = function(keyEvent) {
    if (keyEvent.which == 13) $scope.addTask();
  };

  $scope.addTask = function() {
    console.log($scope.newTasks);
    $scope.orderedTasks = orderNewTasks($scope.newTasks);
    console.log($scope.orderedTasks);
    tasksFactory.addTask($scope.orderedTasks)
    .then(result => $scope.result = result.data)
    .catch(err => console.log(err));

    $window.location.reload();
  };

  $scope.updateTask = function(task, field) {
    
    if (field == 'deadline') {
      task[field] = $scope.toTime(task[field]);
    }; 
    
    $scope.updatedTasks[task._id] = {};
    $scope.updatedTasks[task._id][field] = task[field];
    
    console.log($scope.updatedTasks);

    tasksFactory.updateTask($scope.updatedTasks)
    .then(result => console.log(result))
    .catch(err => console.log(err));

    $scope.updatedTasks = {};
    $window.location.reload();
  };
  
  $scope.toTime = function(date) {
    return /\d\d:\d\d/.exec(date)[0];
  };

  $scope.deleteTask = function(task) {
    tasksFactory.deleteTask(task._id)
    .then(result => $scope.result = result.data)
    .catch(err => console.log(err));

    $window.location.reload();
  };


  $scope.showPrompt = function (ev) {
    console.log("clicked");
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.prompt()
      .title('What would you name your dog?')
      .textContent('Bowser is a common name.')
      .placeholder('Dog name')
      .ariaLabel('Dog name')
      .initialValue('Buddy')
      .targetEvent(ev)
      .required(true)
      .ok('Okay!')
      .cancel('I\'m a cat person');

    $mdDialog.show(confirm).then(function (result) {
      $scope.status = 'You decided to name your dog ' + result + '.';
    }, function () {
      $scope.status = 'You didn\'t name your dog.';
    });
  };

  $scope.logOut = function() {
    tasksFactory.logOut()
    .then(result => $window.location.href = 'http://localhost:3000/')
    .catch(err => console.log(err));
  };

}