$(document).ready(function(){

	// login page
	$('#login-btn').click(function() {
		$.ajax({
			url: "db/login",
			data: {
				username: $('#login-username').val(),
				password: $('#login-password').val()
			},
			 success: function(result){
				alert("success");
			},
			error: function(xhr, status, error) {
				alert("error");
				console.log(error.code);
				window.location.href = "";
			}
		});
	});
	$('#registration-btn').click(function() {
		window.location.href = "registration";
	});

	// registration page
	$('#create-account-btn').click(function() {
		var username = $('#registration-username').val();
		var password = $('#registration-password').val();
		var confirm_password = $('#registration-confirm-password').val();
		if (username === '' || password === '' || confirm_password === '') {
			$("#registration-form").addClass("error");
			$("#registration-error-header").text("Incomplete Form");
			$("#registration-error-body").text("One or more fields have been left blank.");
		} else if (false) { // see if there's a duplicate user
			$("#registration-form").addClass("error");
			$("#registration-error-header").text("Duplicate User");
			$("#registration-error-body").text("Another user with this username already exists.");
		} else if (password != confirm_password) {
			$("#registration-form").addClass("error");
			$("#registration-error-header").text("Passwords do not match");
			$("#registration-error-body").text("Double check if you typed in your passwords correctly.");
		} else {
			window.location.href = "profile";
		}
	});

	$('select.dropdown').dropdown();



});