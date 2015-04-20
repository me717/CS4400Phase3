$(document).ready(function(){
	var username; // the user logged in

	// login page
	$('#login-btn').click(function() {
		$.ajax({
			url: "db/login",
			data: {
				username: $('#login-username').val(),
				password: $('#login-password').val()
			},
			 success: function(result){
				username = $('#login-username').val();
				window.location.href = "search";
			},
			error: function(xhr, status, error) {
				console.log(error.message);
				window.location.href = "";
			}
		});
	});
	$('#registration-btn').click(function() {
		window.location.href = "registration";
	});

	// registration page
	$('#create-account-btn').click(function() {
		var profile_username = $('#registration-username').val();
		var profile_password = $('#registration-password').val();
		var profile_confirm_password = $('#registration-confirm-password').val();
		if (profile_username === '' || profile_password === '' || profile_confirm_password === '') {
			$("#registration-form").addClass("error");
			$("#registration-error-header").text("Incomplete Form");
			$("#registration-error-body").text("One or more fields have been left blank.");
		} else if (profile_password != profile_confirm_password) {
			$("#registration-form").addClass("error");
			$("#registration-error-header").text("Passwords do not match");
			$("#registration-error-body").text("Double check if you typed in your passwords correctly.");
		} else {
			$.ajax({ // check this out, may be janky
				url: "db/register",
				data: {
					username: profile_username,
					password: profile_password
				},
				method: "POST",
				 success: function(result){
				 	username = profile_username;
					window.location.href = "profile";
				},
				error: function(xhr, status, error) {
					$("#registration-form").addClass("error");
					$("#registration-error-header").text("Duplicate User");
					$("#registration-error-body").text("Another user with this username already exists.");
				}
			});
			
		}
	});

	// profile creation page

	$('select.dropdown').dropdown();
	$('.ui.checkbox').checkbox();
	$('#faculty-check').click(function() {
		if($('#faculty-check').hasClass("checked")) {
			$('#faculty-dept').removeAttr("disabled", "disabled");
			$('#faculty-dept').removeClass("disabled");
		} else {
			$('#faculty-dept').attr("disabled", "disabled");
			$('#faculty-dept').addClass("disabled");
		}
	});
	$('#create-profile-btn').click(function() {
		var is_faculty = 0;
		var dept_name;
		if($('#faculty-check').hasClass("checked")) {
			is_faculty = 1;
			dept_name = $('#profile-department').val();
		}
		$.ajax({ // check this out, may be janky
			url: "db/profile",
			data: {
				username: username,
				firstName: $('#profile-firstname').val(),
				lastName: $('#profile-lastname').val(),
				dob: $('#profile-dob').val(),
				gender: $('#profile-gender').val(),
				email: $('#profile-email').val(),
			    address: $('#profile-address').val(),
			    isFaculty: is_faculty,
			    dept: dept_name
			},
			method: "POST",
			 success: function(result){
				window.location.href = "search";

			},
			error: function(xhr, status, error) {
				$("#profile-form").addClass("error");
				$("#profile-error-header").text("Error");
				$("#profile-error-body").text(error.message);
			}
		});
	});

	// search screen
	$('#search-btn').click(function() {
		if ($('#search-isbn').val() === '' && $('#search-title').val() === '' && $('#search-author').val() === ''){
			$("#search-form").addClass("error");
			$("#search-error-header").text("Error");
			$("#search-error-body").text("Please enter the ISBN, Title, or Author.");
		} else {
			$.ajax({
				url: "db/searchBooks",
				data: {
					isbn: $('#search-isbn').val(),
					edition: $('#search-edition').val(),
					author: $('#search-author').val(),
					title: $('#search-title').val()
				},
				 success: function(result){
					console.log(result);
					result.forEach(function(item) {
						$("#search-table").append(
							"<tr>" +
							"<td>" + "[btn]" + '</td>' +
							"<td>" + item.isbn + '</td>' +
							"<td>" + item.title + '</td>' +
							"<td>" + item.author + '</td>' +
							"<td>" + item.edition + '</td>' +
							"<td>" + "123" + '</td>' +
							"</tr>"
						);
					});
				},
				error: function(xhr, status, error) {
					console.log(error.message);
					$("#search-form").addClass("Error");
					$("#search-error-header").text(error.status);
					$("#search-error-body").text(error.message);
				}
			});
		}

		/*var sample = [
		{
			isbn: '0-123-12345-1',
			edition: 4,
			author: 'Stephen Song',
			title: 'Databases for Dummies'

		},
		{
			isbn: '0-123-12345-1',
			edition: 5,
			author: 'Albert Morlan',
			title: 'Databases for Dummies'

		},
		{
			isbn: '0-123-12345-1',
			edition: 6,
			author: 'James Park',
			title: 'Databases for Dummies'

		}
		];*/
	});

});