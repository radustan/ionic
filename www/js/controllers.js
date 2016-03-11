angular.module('starter.controllers', [])

    .controller('HomeCtrl', function ($scope) {
    })

    .controller('ChatsCtrl', function ($scope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        };
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('PlayerDetailsCtrl', function ($scope, $http, $stateParams, $sce) {
        $http.get('js/data.json').success(function (data) {
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
        function ($scope, $http) {
            $http.get('js/data.json').success(function (data) {
                $scope.players = data.players;
                $scope.data = {showDelete: false, showReorder: false};

                $scope.onItemDelete = function (item) {
                    $scope.players.splice($scope.players.indexOf(item), 1);
                };

                $scope.doRefresh = function () {
                    $http.get('js/data.json').success(function (data) {
                        $scope.players = data.players;
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                };

                $scope.toggleStar = function (item) {
                    item.star = !item.star;
                };

                $scope.moveItem = function (item, fromIndex, toIndex) {
                    $scope.players.splice(fromIndex, 1);
                    $scope.players.splice(toIndex, 0, item);
                };
            });
        }])

    .controller('AccountCtrl', function ($scope, Camera, $cordovaFile, $ionicModal, $cordovaSms, $ionicLoading) {
        $scope.settings = {
            enableFriends: true
        };
        $scope.zoomMin = 1;
        $scope.images = [];
        $scope.getPhoto = function () {
            Camera.getPicture().then(function (imageURI) {

                $scope.lastPhoto = imageURI;
                onImageSuccess(imageURI);

                function onImageSuccess(fileURI) {
                    createFileEntry(fileURI);
                }

                function createFileEntry(fileURI) {
                    window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                }

                // 5
                function copyFile(fileEntry) {
                    var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                    var newName = makeid() + name;
                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                            fileEntry.copyTo(
                                fileSystem2,
                                newName,
                                onCopySuccess,
                                fail
                            );
                        },
                        fail);
                }

                // 6
                function onCopySuccess(entry) {
                    $scope.$apply(function () {
                        console.log(entry.nativeURL);
                        $scope.images.push(entry.nativeURL);
                    });
                }

                function fail(error) {
                    console.log("fail: " + error.code);
                }

                function makeid() {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for (var i=0; i < 5; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    return text;
                }
            }, function (err) {
                console.err(err);
            }, {
                quality: 75,
                targetWidth: 320,
                targetHeight: 320,
                saveToPhotoAlbum: false,
                destinationType : 1,
                sourceType : 1, // Camera.PictureSourceType.PHOTOLIBRARY
                allowEdit : false,
                encodingType: 0
            });
        };
        $scope.urlForImage = function(imageName) {
            var name = imageName.substr(imageName.lastIndexOf('/') + 1);
            var trueOrigin = cordova.file.dataDirectory + name;
            return trueOrigin;
        };


        $scope.showImages = function(index) {
            $scope.activeSlide = index;
            $scope.showModal('templates/image-popover.html');
        };

        $scope.showModal = function(templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };

        // Close the modal
        $scope.closeModal = function() {
            $scope.modal.hide();
            $scope.modal.remove()
        };

        $scope.updateSlideStatus = function(slide) {
            var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
            if (zoomFactor == $scope.zoomMin) {
                $ionicSlideBoxDelegate.enableSlide(true);
            } else {
                $ionicSlideBoxDelegate.enableSlide(false);
            }
        };
        
        $scope.smsresponse = ''

        $scope.sendSMS = function(number, text) {
            if (!isNaN(number) && text) {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                $cordovaSms
                    .send(number, text, [])
                    .then(function() {
                        $scope.smsresponse = 'Message Sent';
                        $ionicLoading.hide();
                    }, function(error) {
                        $scope.smsresponse = 'Message Not Sent';
                        $ionicLoading.hide();
                    });

            }
        }
    });
