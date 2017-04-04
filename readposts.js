function loadPost() {
	var loc = document.location.search; // Get location of post
	if (loc.charAt(0) == '?')
		loc = loc.substring(1);
	var post = document.createElement("div"); // Create element to load post
	post.id = "post";
	document.body.appendChild(post);
	$(function(){
		$("#post").load("content/" + loc, "", function() {
			var code = post.innerHTML; // Make the title a header
			post.innerHTML = "<p><h2>" + code.substring(0, code.indexOf('\n')) + "</h2></p>" + code.substring(code.indexOf('\n'));
		});
	}); // Load the post
}

function findPosts(maximum, range, definedMaximum, definedRange) {
	// Add leading zeroes to filename
	var postidraw = "0000000000" + maximum; // There should be 9 digits in each blogpost filename.
	var postid = postidraw.substr(postidraw.length-9)
	var filename = postid + ".bph"; // .bph stands for blogpost head
	// Upon standard function call from script, definedMaximum should equal maximum and definedRange should equal range
	if (maximum <= 0) // No more posts
	{
		return;
	}
	else if (range > 0)
	{
		// Create current post
		var currpost = document.createElement("div");
		// Create element for post and load the post
		currpost.className = "blogpost";
		currpost.id = "bp" + postid;
		// Load the next post. And only upon success, continue to load more posts.
		$.ajax({
			url: "content/" + filename,
			data: {},
			type: "get",
			success: function(code) {
				currpost.innerHTML = "<a href='readpost.html?" + postid + ".blogpost'><h3>" + code.substring(0, code.indexOf('\n')) + "</h3></a>" + code.substring(code.indexOf('\n'));
				findPosts(maximum-1, range-1, definedMaximum, definedRange); // Recursion!
				document.body.appendChild(currpost);
			}
		}); // Only do upon success
	}
	else if (maximum >= 1)
	{
		// If there are next posts when range = 0, do this.
		var morelink = document.createElement("a");
		var minimum = definedMaximum - definedRange;
		morelink.href = "index.html?" + minimum;
		morelink.innerHTML = "More...";
		document.body.appendChild(morelink);
	}
}

function findMaxPost()
{
	var docIndex = document.cookie.indexOf("maxpost=");
	if (docIndex < 0)
	{
		$.ajax({
			url: "content/max.txt",
			data: {},
			type: "get",
			success: function(data) {
				var date = new Date();
				date.setTime(date.getTime()+(1000*60*60)); // Expire in 60 minutes
				document.cookie = "maxpost=" + data + "; expires=" + date.toGMTString() + "; path=/blog"; // Set cookie with expiration date and path
				return findMaxPost();
			}
		});
	}
	else
	{
		var maxPostCookie = document.cookie.substring(docIndex + 8) + ';';
		maxPostCookie = maxPostCookie.substring(0, maxPostCookie.indexOf(";"));
		return maxPostCookie; // Returns it as a string!
	}
}

function fetchPostsWrapper()
{
	var getparams = document.location.search;
	if (getparams == '') getparams = findMaxPost(); // If getparams is empty, substitute for the max post.
	if (getparams.charAt(0) == '?') getparams = getparams.substring(1); // If it starts with a '?', get rid of it.
	var a = parseInt(getparams); // Get the integer
	findPosts(a,8,a,8); // Call findPosts
}

function reloadRange()
{
	console.log("This function reloads and checks for new posts! It is meant only for developers.\n");
	var date = new Date();
	date.setTime(0); // Expire now
	document.cookie = "maxpost=0; expires=" + date.toGMTString() + "; path=/blog"; // Set cookie with expiration date and path
}