var app = angular.module('myApp', ['angular.filter']);
app.controller('projectsController', function ($scope, $http) {
    $scope.projects = null;

    $http.get("https://projects.ndraz.com/GetByCourse.php")
        .success(function (data) {
            $scope.projects = setUpForClasses(data.Projects);
        });
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
