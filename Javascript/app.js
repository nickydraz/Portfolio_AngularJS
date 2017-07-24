var app = angular.module('myApp', ['angular.filter', 'ui.router']);

app.controller('projectsController', function ($scope, $http) {
    $scope.projects = null;
    $http({
            method: "GET",
            url: "https://projects.ndraz.com/GetByCourse.php"
        })
        .then(function successCallback(response) {
            $scope.projects = setUpForClasses(response.data.Projects);
        });
});

app.controller('featuredController', function ($scope, $http) {
    $scope.featured = null;
    $http({
            method: "GET",
            url: "https://projects.ndraz.com/GetFeatured.php"
        })
        .then(function successCallback(response) {
            $scope.featured = trimDescriptions(response.data.Projects);
        });

});

app.controller('detailController', function ($scope, $http, $stateParams) {
    $scope.project = null;
    $http({
            method: "GET",
            url: "https://projects.ndraz.com/GetProject.php?Id=" + $stateParams.projectId
        })
        .then(function successCallback(response) {
            $scope.project = response.data.Projects[0];
        });
});

app.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $urlRouterProvider.otherwise('/');
        var homeState = {
            name: 'home',
            url: '/',
            templateUrl: '../featured.html',
            controller: 'featuredController'
        };
        var coursesState = {
            name: 'courses',
            url: '/Courses',
            templateUrl: '/courses.html',
            controller: 'projectsController'
        };
        var detailState = {
            name: 'detail',
            url: '/Project/:projectId',
            templateUrl: '/project.html',
            controller: 'detailController'
        };
        var aboutState = {
            name: 'about',
            url: '/About',
            templateUrl: '/about.html'
        };

        $stateProvider.state(homeState);
        $stateProvider.state(coursesState);
        $stateProvider.state(aboutState);
        $stateProvider.state(detailState);
    })
    .run(function ($rootScope, $location) {
        var path = function () {
            return $location.path();
        };
        $rootScope.$watch(path, function (newVal, oldVal) {
            $rootScope.activetab = newVal;
        });
    });

app.filter('unsafe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});




function determineCourse(courseName) {
    var projects = $('.course-listing[courseName=' + courseName + ']');
    var nonProjects = $('.course-listing[courseName!=' + courseName + ']');

    nonProjects.hide();
    projects.show();
}

function setUpForClasses(projects) {
    $.each(projects, function (key, course) {
        var innerLength = Object.keys(projects[key])
            .length;
        $.each(course, function (k, v) {
            if (innerLength == 1)
                v.OnlyProject = true;
            else {
                v.OnlyProject = false;
                if ((k + 1) % 2 == 1)
                    v.FirstProject = true;
                else
                    v.FirstProject = false;
            }
        });
    });
    return projects;
}

function trimDescriptions(projects) {
    for (i = 0; i < projects.length; i++) {
        if (projects[i].Description.length > 125)
            projects[i].Description = projects[i].Description.substring(0, 125) + '...';
    }

    return projects;
}
