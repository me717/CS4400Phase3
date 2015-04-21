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
				hold_copyNumber = result[0].copyNumber;
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
			 	$('#extension-originalcheckout').text(result[0].dateOfIssue);
			 	$('#extension-currentextension').text(result[0].extensionDate);
			 	$('#extension-newcheckout').text(result[0].newExtensionDate);
			 	$('#extension-currentreturn').text(result[0].returnDate);
			 	$('#extension-newreturn').text(result[0].newReturnDate);
				$('#extension-content').show();
			},
			error: function(xhr, status, error) {
				$("#extension-form").addClass("error");
				$("#extension-error-header").text("Error");
				$("#extension-error-body").text("Could not find the Issue ID.");
			}
		});
	});

	$('#extension-submit-btn').click(function() {
		$.ajax({ // check this out, may be janky
			url: "db/extension",
			data: {
				issueId: $('#extension-issueID').val(),
        		username: ''
			},
			method: "POST",
			 success: function(result){
			 	alert("extension placed");
			},
			error: function(xhr, status, error) {
				$("#extension-form").addClass("error");
				$("#extension-error-header").text("Error");
				$("#extension-error-body").text("Could not process extension");
			}
		});
	});

	// future hold screen
	$('#futurehold-content').hide();
	$('#futurehold-isbn-btn').click(function() {
		$.ajax({ 
			url: "db/futureRequestSearch",
			data: {
				isbn: $('#futurehold-isbn').val()
			},
			 success: function(result){
			 	$('#futurehold-form').removeClass("error");
			 	$('#futurehold-copyNumber').text(result[0].copyNumber);
			 	$('#futurehold-expectedDate').text(result[0].availableDate);
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
				isbn: $('#futurehold-isbn').val(),
				// copyNumber: $('#futurehold-copyNumber').val()
				copyNumber: 0
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

	// track book screen
	$('#track-content').hide();
	$('#track-isbn-btn').click(function() {
		$.ajax({ 
			url: "db/trackLocation",
			data: {
				isbn: $('#track-isbn').val()
			},
			 success: function(result){
			 	$('#track-form').removeClass("error");
			 	$('#track-floor').text(result[0].floorNumber);
			 	$('#track-shelf').text(result[0].shelfNumber);
			 	$('#track-aisle').text(result[0].aisleNumber);
			 	$('#track-subject').text(result[0].subjectName);
				$('#track-content').show();
			},
			error: function(xhr, status, error) {
				$("#track-form").addClass("error");
				$("#track-error-header").text("Error");
				$("#track-error-body").text("Could not find the ISBN.");
			}
		});
	});

	// checkout screen
	$('#checkout-content').hide();
	$('#checkout-issueid-btn').click(function() {
		$.ajax({ 
			url: "db/checkout",
			data: {
				issueId: $('#checkout-issueID').val()
			},
			 success: function(result){
			 	$('#checkout-form').removeClass("error");
			 	$('#checkout-username').text("[USERNAME]"); // session variable?
			 	$('#checkout-isbn').text(result[0].isbn);
			 	$('#checkout-copynumber').text(result[0].copyNumber);
			 	$('#checkout-checkoutdate').text(Date()); // CURDATE()
			 	$('#checkout-returndate').text(result[0].returnDate);
				$('#checkout-content').show();
			},
			error: function(xhr, status, error) {
				$("#checkout-form").addClass("error");
				$("#checkout-error-header").text("Error");
				$("#checkout-error-body").text(error.message);
			}
		});
	});

	// return screen
	$('#return-content').hide();
	$('#return-issueid-btn').click(function() {
		var damaged = 0;
		if ($('#return-damaged').hasClass("checked")) {
			damaged = 1;
		}
		$.ajax({ 
			url: "db/return",
			data: {
				issueId: $('#return-issueID').val(),
				isDamaged: damaged
			},
			method: "POST",
			 success: function(result){
			 	$('#return-form').removeClass("error");
			 	$('#return-username').text(result[0].username); // session variable?
			 	$('#return-isbn').text(result[0].isbn);
			 	$('#return-copynumber').text(result[0].copyNumber);
				$('#return-content').show();
				if ($('#return-damaged').hasClass("checked")) {
					alert("damaged book return, going to screen");
					window.location.href = "lostdamaged";
				} else {
					alert("book returned safely");
				}
			},
			error: function(xhr, status, error) {
				$("#return-form").addClass("error");
				$("#return-error-header").text("Error");
				$("#return-error-body").text(error.message);
			}
		});
	});

	// lostdamaged screen
	$('#penalty-submit-btn').click(function() {
		$.ajax({ 
			url: "db/penalty",
			data: {
				isbn: $('#penalty-isbn').val(),
				copyNumber: $('#penalty-copyNumber').val()
				penalty: $('#penalty-amount').val()
			},
			method: "POST",
			 success: function(result){
			 	$('#penalty-form').removeClass("error");
			 	$('#penalty-time').text(Date());
			 	$('#penalty-lastUser').text(result.username);
			},
			error: function(xhr, status, error) {
				$("#penalty-form").addClass("error");
				$("#penalty-error-header").text("Error");
				$("#penalty-error-body").text(error.message);
			}
		});
		
	});


});