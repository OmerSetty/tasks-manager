const indexApp = angular.module('indexApp', []);

indexApp.controller('indexController', ['$scope', '$window', 'usersFactory', indexController]);
function indexController($scope, $window, usersFactory, usersService) {

  $scope.showRegisteration = function() {
    $scope.showRegistrationClass = 'register';
  }

  $scope.showLogin = function() {
    $scope.showRegistrationClass = 'login';
  }

  $scope.validation = function() {
    const validationArray = [$scope.validateEmail, $scope.validatePassword, $scope.validateVerifiedPassword]
    for (validation of validationArray) {
      if (!validation().result) {
        return alert(validation().info);
      }
    }
    return $scope.registeration();
  }

  $scope.registeration = function() {
    const config = {
      email: $scope.registerationEmail,
      password: $scope.registerationPassword
    };

    usersFactory.register(config)
    .then(result => alert('register good ' + result))
    .catch(err => alert(err));
  }

  $scope.validateEmail = function() {
    return {
      result: /\b\w+@\w+\.\w+\b/.test($scope.registerationEmail),
      get info() {return this.result ? 
        "The Email is valid." : "The email address is invalid."}
    };
  }

  $scope.validatePassword = function() {
    return {
      result: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test($scope.registerationPassword),
      get info() {return this.result ? 
        "The Password is valid." : "The Password is invalid."}
    };
    
  }

  $scope.validateVerifiedPassword = function() {
    return {
      result: $scope.registerationPassword == $scope.verifiedPassword,
      get info() {return this.result ? 
        "" : "The given password is not match the initial password."}
    };
  }

  $scope.liveValidation = function(field,
    validationIndicator, validationClass, validationTest) {
    if (!$scope[field]) {
      $scope[validationClass] = 'no-validation';
      $scope[validationIndicator] = '';
    }
    else {
      const validationStatus = $scope[validationTest]();
      $scope[validationIndicator] = validationStatus.info;
      $scope[validationClass] = validationStatus.result ?
        'valid' : 'invalid';
    }
  }

  $scope.loginCheck = function() {
    const data = {
      params: {
        email: $scope.loginEmail,
        password: $scope.loginPassword
      }
    };
    usersFactory.login(data)
    .then(result => { 
      $scope.user = result;
      console.log($scope.user);
      usersFactory.getLoggedUserId()
      .then(result => {
        console.log(result);
      })
      .catch(err => alert(err.data));
      $window.location.href = 'http://localhost:3000/main';
    })
    .catch(err => alert(err.data));

    

  };
  
  

  $scope.fact = "idan gay";
}