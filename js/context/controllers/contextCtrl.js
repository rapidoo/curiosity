Curiosity.controller('contextCtrl', function($scope, context){	
	$scope.data = context.info;	
	$scope.info.newContextName = "";
	
	$scope.sendContext = function() {
		context.sendContext();
	}

	$scope.saveNewContext = function () {
		context.newContext($scope.info.newContextName); 
	}

	$scope.setDefaultContext = function () {
		context.setDefaultContext($scope.data.currentContext.contextName);
	}

	$scope.updateContext = function () {
		context.updateContext();
	}

	$scope.selectContext = function () {
		if ($scope.data.contextIdx != null && $scope.data.contextIdx >= 0) {
			context.loadContext($scope.data.contextList[$scope.data.contextIdx]._id);
		}
		else {
			context.setContextIdx();
		}
	}

	$scope.deleteContext = function () {
		context.deleteContext();
	}

	$scope.reloadContextList = function () {
		context.getContextList();
	}
});