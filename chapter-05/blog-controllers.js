// Header controller presents a description for the blog
blog.controller('HeadCtrl', function ($scope) {
    $scope.description = 'My important Blog';
});

// Controls the blog content including all methods related to posts
blog.controller('ContentCtrl', function ($scope, Posts) {
    // Retrieve the posts from our "server". If this succeeds, we'll
    // put the posts into our $scope and do some post-processing.
    Posts.getPosts().success(function (data) {
        var posts;
        $scope.posts = data.posts;
        posts = $scope.posts;
        // Convert timestamps to JS timestamps (w/ millisecond precision)
        var i = posts.length;
        while (i--) {
            posts[i].date = posts[i].date * 1000;
        }
    });
    // This closes all editors if we happen to click the "new post" button
    $scope.$watch('posts', function (new_val, old_val) {
        var i;
        if (new_val !== old_val) {
            i = new_val.length;
            while (i--) {
                new_val[i].editing = false;
            }
        }
    });

    // Begins editing a post by making a temporary copy of the title and body,
    // and setting the "editing" flag for that post to be true.
    $scope.edit = function (post) {
        post.temp = {
            title: post.title,
            body: post.body
        };
        post.editing = true;
    };
    // Saves a post by copying the contents of the temp object into the
    // title and body. Updates the author and post date, and sets the editing
    // flag to false, thereby closing the text editors. In addition we set the
    // controller-wide "new_post" model to be false, so the "New Post" button appears.
    $scope.save = function (post) {
        post.title = post.temp.title;
        post.body = post.temp.body;
        delete post.temp;
        post.date = new Date();
        post.author = 'me'; // in lieu of an authentication system
        post.editing = false;
        $scope.posts.unshift(post); // new posts go at the top
        delete $scope.new_post;
    };
    // Cancels a post edit. Does not copy temp data, and sets the editing flag
    // to false. In addition we set the controller-wide "new_post" model to be
    // false, so the "New Post" button appears.
    $scope.cancel = function (post) {
        delete post.temp;
        post.editing = false;
        delete $scope.new_post;
    };
    // Creates a new post
    $scope.newPost = function () {
        $scope.new_post = {
            temp: {
                title: 'Enter Title Here',
                body: 'Enter Body Here'
            },
            editing: true
        };
    };
});
