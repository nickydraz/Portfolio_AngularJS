var homeApp = angular.module('homeApp', []);
homeApp.controller('featuredController', function ($scope, $http) {
    $scope.featured = null;

    $http.get("https://projects.ndraz.com/GetFeatured.php")
        .success(function (data) {
            $scope.featured = trimDescriptions(data.Projects);
        });
});

function trimDescriptions(projects) {
    for (i = 0; i < projects.length; i++) {
        if (projects[i].Description.length > 125)
            projects[i].Description = projects[i].Description.substring(0, 125) + '...';
    }

    return projects;
}
