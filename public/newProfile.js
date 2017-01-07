var transaction = angular.module('loginActivity', []);

function mainController($scope, $http) {
    $scope.createUser= function(user) {
        var JSONuser = {"username": user.username, "password": user.password};
        $http.post(
            '/create',
            JSON.stringify(JSONuser)
        )
        $scope.new = true;
    }
}