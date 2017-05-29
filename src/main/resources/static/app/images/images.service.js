(function() {

    'use strict';

    angular.module('tcc').factory('ImageService', Factory);

    Factory.$inject = ['BASE_URL', '$http', '$q'];

    function Factory(BASE_URL, $http) {
        var service = {
            post: post,
            get: get
        };

        function post(dataUri) {
            var blob = dataURItoBlob(dataUri);
            var fd = new FormData();
            fd.append('file', blob);
            return $http.post(BASE_URL + '/images', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        }

        function get(id) {
            return $http.get(BASE_URL + '/images/entity/' + id);
        }

        function dataURItoBlob(dataURI) {
            var byteString = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            var blob = new Blob([ab], {type: mimeString});
            return blob;
        }

        return service;
    }

})();