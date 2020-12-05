mainApp.controller('indexController', ['$scope', '$window', '$mdToast', 'usersService', 'indexFactory', indexController]);
function indexController($scope, $window, $mdToast, usersService, indexFactory) {
  
  $scope.showRegisteration = () => {
    $scope.showRegistrationClass = 'register';
  }

  $scope.showLogin = () => {
    $scope.showRegistrationClass = 'login';
  }

  $scope.validation = () => {
    const validationArray = [$scope.validateEmail, $scope.validatePassword, $scope.validateVerifiedPassword]
    for (validation of validationArray) {
      if (!validation().result) {
        return $scope.toastMessage(validation().info);
      }
    }
    return $scope.registeration();
  }

  $scope.registeration = () => {
    const config = {
      email: $scope.registerationEmail,
      password: $scope.registerationPassword
    };

    indexFactory.register(config)
    .then(() => $window.location.href = 'http://localhost:3000/main')
    .catch(err => {
      $scope.toastMessage(err.data)
    });
  }

  $scope.validateEmail = () => {
    return {
      result: /\b\w+@\w+\.\w+\b/.test($scope.registerationEmail),
      get info() {return this.result ? 
        "The Email is valid." : "The email address should be in format of 'a@a.a'"}
    };
  }

  $scope.validatePassword = () => {
    return {
      result: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test($scope.registerationPassword),
      get info() {return this.result ? 
        "The Password is valid." : "The Password should has at least 8 charachters, a capital letter and a small letter."}
    };
  }

  $scope.validateVerifiedPassword = () => {
    return {
      result: $scope.registerationPassword == $scope.verifiedPassword,
      get info() {return this.result ? 
        "" : "The given password is not match the initial password."}
    };
  }

  $scope.liveValidation = (field,
    validationIndicator, validationClass, validationTest) => {
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

  $scope.loginCheck = () =>{
    const data = {
      params: {
        email: $scope.loginEmail,
        password: $scope.loginPassword
      }
    };
    $scope.loginUser(data);
  };
  
  $scope.loginUser = (data) => {
    indexFactory.login(data)
    .then(() => { 
      $window.location.href = 'http://localhost:3000/main';
    })
    .catch(err => $scope.toastMessage(err.data));
  };
  
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

  


  $scope.fact = "idan gay";
}