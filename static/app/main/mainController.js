mainApp.controller('mainController', ['$scope', '$window', '$mdSidenav', '$mdDialog', '$mdToast', 'usersService', 'mainFactory', mainController]);
function mainController($scope, $window, $mdSidenav, $mdDialog, $mdToast, usersService, mainFactory) {
  
  $scope.COLORS = ['blue', 'black', 'orange', 'green', 'grey', 'purple', 'red'];
  const shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  };
  shuffleArray($scope.COLORS);

  const currentDay = moment().format('D.M.YYYY');
  $scope.getTasksOfDay = () => {
    mainFactory.getTasksOfDay(currentDay, $scope.userId)
    .then((result) => {
      $scope.tasksOfDay = result.data.tasksOfDay;
      console.log($scope.tasksOfDay);
      $scope.values = result.data.values[0];
      $scope.filterList = $scope.reArrangeList($scope.values, ['assignee', 'status']);
      
      $scope.userData = result.data.user;
      console.log($scope.userData.isAdmin);

      $scope.dynamicField = $scope.userData.groupBy == 'category' ? 'priority' : 'category';
      $scope.userData.team = $scope.userData.team;
      console.log($scope.userData.team);
      console.log($scope.userData.username);

      if ($scope.userData.groupBy == 'all') addAll();
    })
    .catch((err) => {
      console.log(err);
    });
  };
  // // a
  // $scope.userId = "5f53df6bc17e360614e676d7";
  // b
  // $scope.userId = "5fc286d5f1b5eb48a42983d3";
  // // c
  // $scope.userId = "5fc28749b3aa2f14548becb3";
  // $scope.userId = "5fc6b94cc15c9a0415fd2d8c";
  // $scope.getTasksOfDay();

  usersService.getLoggedUserId()
  .then(result => {
    $scope.userId = result.data.userId;
    $scope.getTasksOfDay();
  })
  .catch(err => console.log(err));
  
  $scope.toTime = (date) => {
    return /\d\d:\d\d/.exec(date)[0];
  };

  $scope.tasksAmount = (length) => {
    return length == 1 ? `${length} task` : `${length} tasks`;
  };

  $scope.openLeftMenu = () => {
    $mdSidenav('left').toggle();
  };

  const orderNewTasks = (newTasksObj) =>  {
    // adding the group key to the object
    const addedKey = Object.keys(newTasksObj);
    newTasksObj[addedKey][$scope.userData.groupBy] = addedKey[0];

    // removing the empty fields (fields in which the user
    // wrote and left empty),
    // and converting the deadline to format of hour only (hh:mm)
    for (key in newTasksObj[addedKey]) {
      if (newTasksObj[addedKey][key] == '') delete newTasksObj[addedKey][key];
      if (key == 'deadline') newTasksObj[addedKey][key] = $scope.toTime(newTasksObj[addedKey][key]);
    }
    return newTasksObj[addedKey];
  };

  // re-arranging list by filtering by specific keys
  $scope.reArrangeList = (list, keys) => {
    return Object.keys(list)
    .filter(key => keys.includes(key))
    .reduce((obj, key) => {
      obj[key] = list[key];
      return obj;
    }, {});
  };

  
  $scope.filterBy = {};
  $scope.filteredTasks = {};
  $scope.filterByText = '';

  // setting the text which displays in the select filter element
  $scope.filterText = () => {
    return angular.equals($scope.filterBy, {}) ? 'Filter By: ': `Filter by: ${$scope.filterBy.field} - ${$scope.filterBy.value}`;
  };

  // if no filter was defined - don't filter, otherwise - filter
  $scope.setTaskFilter = (task) => {
    return angular.equals($scope.filterBy, {}) ? true : task[$scope.filterBy.field] == $scope.filterBy.value;
  };

  $scope.changeGroupBy = () => {
    mainFactory.changeGroupBy($scope.userId, $scope.userData.groupBy)
    .then(() => $scope.toastMessage('the order was updated successfully'))
    .catch(err => console.log(err));
  };

  // setting the dynamic field to be contrary to the groupBy parameter
  $scope.groupField = () => {
    $scope.dynamicField = $scope.userData.groupBy == 'category' ? 'priority' : 'category';
    $scope.changeGroupBy();
  };

  // adding the 'all' key to every task object, so the 'groupBy' could group all of the tasks
  const addAll = () => {
    $scope.tasksOfDay.forEach(task => {
        task['all'] = 'All Tasks';
      });
  };
  
  $scope.showAllTasks = () => {
    $scope.userData.groupBy = 'all';
    addAll();
    $scope.changeGroupBy();
  };

  $scope.doTask = (task) => {
    task.status = task.status == 'done' ? 'in progress' : 'done';
    $scope.updateTask(task, ['status']);
  };

  $scope.doneClass = (task) => {
    return task.status == 'done' ? 'rgb(191 190 188)' : 'white';
  };


  $scope.newTasks = {};
  $scope.updatedTasks = {};

  $scope.enterPressed = (keyEvent, action, task, parameter) => {
    if (keyEvent.which != 13) return;
    if (action == 'add') $scope.addTaskOfKey(parameter);
    else if (action == 'update') $scope.updateTask(task, [parameter]);
  };

  $scope.addTaskOfKey = (key) => {
    $scope.newTasks = $scope.reArrangeList($scope.newTasks, [key]);
    if (angular.equals($scope.newTasks, {}) || $scope.newTasks[key].title === undefined) return $scope.toastMessage("the task must has a 'title' property");
    
    $scope.orderedTasks = orderNewTasks($scope.newTasks);
    $scope.addTask($scope.orderedTasks);

    $scope.newTasks = {};    
  };

  $scope.addGeneralTask = () => {
    for (key in $scope.newTasks['general']) {
      if (key == 'deadline') $scope.newTasks['general'][key] = $scope.toTime($scope.newTasks['general'][key]);
    }
    if (angular.equals($scope.newTasks['general'], {}) || $scope.newTasks['general'].title === undefined) return $scope.toastMessage("the task must has a 'title' property");
    $scope.addTask($scope.newTasks['general']);
    $scope.newTasks['general'] = {};

    $mdDialog.hide();
  };
  
  $scope.addTask = (tasks) => {
    tasks.team = $scope.userData.team;
    mainFactory.addTask(tasks)
    .then(() => $scope.toastMessage('the task was added successfully'))
    .catch(err => console.log(err));

    $scope.getTasksOfDay();
  };

  $scope.editedFields = [];
  
  $scope.addEditedField = (field) => {
    if (!$scope.editedFields.includes(field)) $scope.editedFields.push(field);
  };

  $scope.updateTask = (task, fields) => {
    const originalValues = $scope.originalFieldsValues || {};
    const updatedTask = {
      taskId: task._id,
      update: {}
    };
    
    for (field of fields) {
      if (field == 'deadline') {
        task[field] = $scope.toTime(task[field]);
      }
      if (originalValues[field] != task[field]) updatedTask.update[field] = task[field];
    };
    
    mainFactory.updateTask(updatedTask)
    .then(() => $scope.toastMessage('the task was updated successfully'))
    .catch(err => console.log(err));

    $scope.editedFields = [];
    $scope.originalFieldsValues = {};
    $scope.getTasksOfDay();
  };

  $scope.deleteTask = (task) => {
    mainFactory.deleteTask(task._id)
    .then(() => $scope.toastMessage('the task was deleted successfully'))
    .catch(err => console.log(err));

    $scope.getTasksOfDay();
  };

  $scope.showTaskAddition = (ev) => {
    $mdDialog.show({
      controller: mainController,
      templateUrl: 'addTaskDialog.html',
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application to prevent interaction outside of dialog
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      scope: $scope,
		  preserveScope: true
      // fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    }).then(() => {
      console.log("closed");
    }, () => {
      $scope.status = 'You cancelled the dialog.';
      console.log($scope.status);
    });
  };

  $scope.showTaskEdition = (ev, task) => {
    $scope.editedTask = task;
    $scope.originalFieldsValues = {
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      assignee: task.assignee,
      status: task.status,
      category: task.category,
      priority: task.priority,
    };
    
    $mdDialog.show({
      controller: mainController,
      templateUrl: 'editTaskDialog.html',
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application to prevent interaction outside of dialog
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      scope: $scope,
		  preserveScope: true
      // fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    }).then(() => {
      console.log("closed");
    }, () => {
      $scope.status = 'You cancelled the dialog.';
      console.log($scope.status);
    });
  };


  // $scope.hide = () => {
  //   $mdDialog.hide();
  // };

  // $scope.cancel = () => {
  //   $mdDialog.cancel();
  // };


  $scope.toastMessage = function(content) {
    $mdToast.show(
      $mdToast.simple()
      .textContent(content)
      .position('top center')
      .hideDelay(3000))
    .then(function() {
      console.log('Toast dismissed.');
    }).catch(function() {
      console.log('Toast failed or was forced to close early by another toast.');
    });
  };

  $scope.editTask = (editedTask) => {
    $scope.updateTask(editedTask, $scope.editedFields);
    $mdDialog.hide();
  };
  
  
  $scope.logOut = () => {
    mainFactory.logOut()
    .then(() => $window.location.href = 'http://localhost:3000/')
    .catch(err => console.log(err));
  };

}