var transaction = angular.module('transactionApp', []);

function mainController($scope, $http) {
    $scope.formData = {};
    console.log ('Can I do this?')
    $http.get('/api/transaction')
        .success(function(data) {
            console.log('Hello there');
            $scope.transactions = data;
            console.log ('Got the info and go')
            console.log(data);
        })
        .error(function(data){
            console.log ('Error ' + data);
        });

    $scope.createTransaction = function() {
        $http.post('/api/transaction', $scope.formData)
            .success(function(data){
                $scope.formData = {}; // clear the form data
                $scope.transactions = data;
                console.log (data);
            })
            .error(function (data) {
                console.log ('Error ' + data);
            })
    };

        // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/transaction/' + id)
            .success(function(data) {
                $scope.transactions = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };        
}