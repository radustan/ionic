angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('PlayerDetailsCtrl', function($scope, $http, $stateParams, $sce) {
    $http.get('js/data.json').success(function(data) {
      for (var i = 0; i < data.players.length; i++) {
        if (data.players[i].number === parseInt($stateParams.pId)) {
          $scope.player = data.players[i];
          var imgUrl = 'img/' + $scope.player.shortname + '.jpg';
          $scope.player.img = imgUrl;
              console.log($scope.player);
        }
      }
    });
})

.controller('PlayersCtrl', ['$scope', '$http', '$state',
  function($scope, $http) {
    $http.get('js/data.json').success(function(data) {
      $scope.players = data.players;
      $scope.data = { showDelete: false, showReorder: false };

      $scope.onItemDelete = function(item) {
        $scope.players.splice($scope.players.indexOf(item), 1);
      };

      $scope.doRefresh = function() {
        $http.get('js/data.json').success(function(data) {
          $scope.players = data.players;
          $scope.$broadcast('scroll.refreshComplete');
        });
      };

      $scope.toggleStar = function(item) {
        item.star = !item.star;
      };

      $scope.moveItem = function(item, fromIndex, toIndex) {
        $scope.players.splice(fromIndex, 1);
        $scope.players.splice(toIndex, 0, item);
      };
    });
  }])

.controller('AccountCtrl', function($scope, Camera) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.getPhoto = function() {
    Camera.getPicture().then(function (imageURI) {
      console.log(imageURI);
    }, function (err) {
      console.err(err);
    });
  }
});
