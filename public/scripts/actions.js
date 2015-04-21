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
			 	$('#profile-form').removeClass("error");
				window.location.href = "search";
			},
			error: function(xhr, status, error) {
				$("#profile-form").addClass("error");
				$("#profile-error-header").text("Error");
				$("#profile-error-body").text(error.message);
			}
		});
	});

	// search/hold screens
	$('#hold-content').hide();
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
				 	$('#profile-form').removeClass("error");
				 	$('#search-header').text("Hold Request For Book");
				 	$('#search-form').hide();
				 	$('#hold-content').show();

					console.log(result);
					result.forEach(function(item) {
						$("#search-table").append(
							"<tr>" +
							"<td class='field'><div class='ui radio checkbox'><input type='radio' name='search-select'></div></td>" +
							"<td class='search-isbn'>" + item.isbn + '</td>' +
							"<td>" + item.title + '</td>' +
							"<td>" + item.author + '</td>' +
							"<td>" + item.edition + '</td>' +
							"<td>" + item.numberAvailable + '</td>' +
							"</tr>"
						);
					});
					$('.ui.checkbox').checkbox();
				},
				error: function(xhr, status, error) {
					console.log(error.message);
					$("#search-form").addClass("Error");
					$("#search-error-header").text(error.status);
					$("#search-error-body").text(error.message);
				}
			});
		}
	});

	$('#hold-back').click(function() {
		$('#search-header').text("Search Books");
		$('#search-form').show();
		$('#hold-content').hide();
	});

	$("#hold-error").hide();
	$('#hold-submit').click(function() {
		var hold_isbn = $('input[name="search-select"]:checked', '#search-table').parent().parent().parent().find('.search-isbn').text();
		var hold_copyNumber;

		$.ajax({
			url: "db/getCopyNumber",
			data: {
				isbn: hold_isbn
			},
			 success: function(result){
				hold_copyNumber = result[0];
				alert("copy number: " + hold_copyNumber);
				$.ajax({
					url: "db/placeHold",
					data: {
						isbn: hold_isbn,
						copyNumber: hold_copyNumber,
						username: ''
					},
					method: "POST",
					 success: function(result){
					 	$("#hold-error").hide();
						alert(result);
						console.log(result);
					},
					error: function(xhr, status, error) {
						$("#hold-error").show();
						$("#hold-error-header").text("Error");
						$("#hold-error-body").text("Unable to place hold.");
					}
				});
			},
			error: function(xhr, status, error) {
				$("#hold-error").show();
				$("#hold-error-header").text("Error");
				$("#hold-error-body").text("Unable to find copy number");
			}
		});
	});

	// request a hold screen
	$('#extension-content').hide();
	$('#extension-issueid-btn').click(function() {
		$.ajax({ // check this out, may be janky
			url: "db/extensionInfo",
			data: {
				issueId: $('#extension-issueID').val()
			},
			 success: function(result){
			 	$('#extension-form').removeClass("error");
			 	$('#extension-originalcheckout').text(result[0].dateOfIssue.toUTCString());
			 	$('#extension-currentextension').text(result[0].extensionDate.toUTCString());
			 	$('#extension-newcheckout').text(result[0].newExtensionDate.toUTCString());
			 	$('#extension-currentreturn').text(result[0].returnDate.toUTCString());
			 	$('#extension-newreturn').text(result[0].newReturnDate.toUTCString());
				$('#extension-content').show();
			},
			error: function(xhr, status, error) {
				$("#extension-form").addClass("error");
				$("#extension-error-header").text("Error");
				$("#extension-error-body").text("Could not find the Issue ID.");
			}
		});
	});

	// future hold screen
	$('#futurehold-content').hide();
	$('#futurehold-isbn-btn').click(function() {
		$.ajax({ 
			url: "db/futureRequestSearch",
			data: {
				isbn: $('#futurehold-isbn-btn').val()
			},
			 success: function(result){
			 	$('#futurehold-form').removeClass("error");
			 	$('#futurehold-copyNumber').text(result[0].copyNumber);
			 	$('#futurehold-expectedDate').text(result[0].availableDate.toUTCString());
				$('#futurehold-content').show();
			},
			error: function(xhr, status, error) {
				$("#futurehold-form").addClass("error");
				$("#futurehold-error-header").text("Error");
				$("#futurehold-error-body").text("Could not find the ISBN.");
			}
		});
	});

	$('#futurehold-submit-btn').click(function() {
		$.ajax({ 
			url: "db/futureRequestPlace",
			data: {
				username: '',
				isbn: $('#futurehold-isbn-btn').val(),
				copyNumber: $('#futurehold-copyNumber').val()
			},
			 success: function(result){
			 	$('#futurehold-form').removeClass("error");
			 	alert("requested");
			},
			error: function(xhr, status, error) {
				$("#futurehold-form").addClass("error");
				$("#futurehold-error-header").text("Error");
				$("#futurehold-error-body").text("Error processing the hold.");
			}
		});
	});
});