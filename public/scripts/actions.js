$(document).ready(function(){
	var username; // the user logged in

	var months = ['', 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

	$('.ui.dropdown').dropdown();

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
				$("#login-form").addClass("error");
				$("#login-error-header").text("Unable to Login");
				$("#login-error-body").text("Make sure your username and password are correct.");
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
		if ($('#profile-firstname').val() === '' ||
			$('#profile-lastname').val() === '' ||
			$('#profile-gender').val() === '' ||
			$('#profile-dob').val() === '' ||
			$('#profile-email').val() === '' ||
			$('#profile-address').val() === '') {
				$("#profile-form").addClass("error");
				$("#profile-error-header").text("Error");
				$("#profile-error-body").text("Make sure all the fields are filled out.");
		} else {
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
		}
		
	});

	// search/hold screens
	$('#hold-content').hide();
	$('#hold-message').hide();
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
					$.ajax({
						url: "db/searchReservedBooks",
						data: {
							isbn: $('#search-isbn').val(),
							edition: $('#search-edition').val(),
							author: $('#search-author').val(),
							title: $('#search-title').val()
						},
						 success: function(result){
							result.forEach(function(item) {
								$("#search-table").append(
									"<tr class='active'>" +
									"<td class='disabled'>Reserved Book</td>" +
									"<td class='search-isbn'>" + item.isbn + '</td>' +
									"<td>" + item.title + '</td>' +
									"<td>" + item.author + '</td>' +
									"<td>" + item.edition + '</td>' +
									"<td>" + item.numberAvailable + '</td>' +
									"</tr>"
								);
							});
						},
						error: function(xhr, status, error) {
							console.log(error.message);
							$("#search-form").addClass("Error");
							$("#search-error-header").text("Error");
							$("#search-error-body").text("Error while searching reserved books");
						}
					});
				},
				error: function(xhr, status, error) {
					console.log(error.message);
					$("#search-form").addClass("Error");
					$("#search-error-header").text("Error");
					$("#search-error-body").text("Error while searching books");
				}
			});
		}
	});

	$('#hold-back').click(function() {
		$('#search-header').text("Search Books");
		$("#search-table").empty();
		$('#search-form').show();
		$('#hold-submit').removeClass("disabled");
		$("#hold-message").hide();
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
					 	$("#hold-message").show();
					 	$("#hold-message-header").text("Hold Successful");
					 	$("#hold-message-body").text("Book Copy #" + hold_copyNumber + " is now on hold. Issue ID: " + result.insertId);
					 	$('#hold-submit').addClass("disabled");
					},
					error: function(xhr, status, error) {
						$("#hold-error").show();
						$("#hold-message").hide();
						$("#hold-error-header").text("Error");
						$("#hold-error-body").text("Unable to place hold.");
					}
				});
			},
			error: function(xhr, status, error) {
				$("#hold-error").show();
				$("#hold-message").hide();
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
			 	if (result.length) {
		 		 	$('#extension-form').removeClass("error");
		 		 	$('#extension-originalcheckout').text(result[0].dateOfIssue);
		 		 	$('#extension-currentextension').text(result[0].extensionDate);
		 		 	$('#extension-newcheckout').text(result[0].newExtensionDate);
		 		 	$('#extension-currentreturn').text(result[0].returnDate);
		 		 	$('#extension-newreturn').text(result[0].newReturnDate);
		 			$('#extension-content').show();
			 	} else {
			 		$("#extension-message").hide();
			 		$("#extension-form").addClass("error");
			 		$("#extension-error-header").text("Error");
			 		$("#extension-error-body").text("Could not find the Issue ID.");
			 	}
			},
			error: function(xhr, status, error) {
				$("#extension-message").hide();
				$("#extension-form").addClass("error");
				$("#extension-error-header").text("Error");
				$("#extension-error-body").text("Could not find the Issue ID.");
			}
		});
	});

	$("#extension-message").hide();
	$('#extension-submit-btn').click(function() {
		$.ajax({ // check this out, may be janky
			url: "db/extension",
			data: {
				issueId: $('#extension-issueID').val(),
        		username: ''
			},
			method: "POST",
			 success: function(result){
			 	console.log(result);
			 	if (result.affectedRows > 0) {
			 		$("#extension-message").show();
			 		$("#extension-form").removeClass("error");
			 		$("#extension-message-header").text("Success");
			 		$("#extension-message-body").text("Book has been checked out.");
			 	} else {
			 		$("#extension-message").hide();
			 		$("#extension-form").addClass("error");
			 		$("#extension-error-header").text("Error");
			 		$("#extension-error-body").text("Could not process extension");
			 	}
			},
			error: function(xhr, status, error) {
				$("#extension-message").hide();
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
			 	if (result[0].availableDate == null) {
			 		$("#futurehold-form").addClass("error");
			 		$("#futurehold-error-header").text("Error");
			 		$("#futurehold-error-body").text("Reserved books cannot be put on hold.");
			 	} else {
			 		 	$('#futurehold-form').removeClass("error");
			 		 	$('#futurehold-copyNumber').text(result[0].copyNumber);
			 		 	$('#futurehold-expectedDate').text(result[0].availableDate);
			 			$('#futurehold-content').show();
			 	}
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
			 	if(result.length) {
			 		$('#track-form').removeClass("error");
				 	$('#track-floor').text(result[0].floorNumber);
				 	$('#track-shelf').text(result[0].shelfNumber);
				 	$('#track-aisle').text(result[0].aisleNumber);
				 	$('#track-subject').text(result[0].subjectName);
					$('#track-content').show();
			 	} else {
			 		$("#track-form").addClass("error");
			 		$("#track-error-header").text("Error");
			 		$("#track-error-body").text("Could not find the ISBN.");
			 	}
			 	
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
			method: 'POST',
			 success: function(result){
			 	if (result.message === "Hold has expired") {
			 		$("#checkout-form").addClass("error");
			 		$("#checkout-error-header").text("Error");
			 		$("#checkout-error-body").text("Hold has expired");
			 	} else {
			 		console.log(result);
		 		 	$('#checkout-form').removeClass("error");
		 		 	$('#checkout-username').text(result[0].username);
		 		 	$('#checkout-isbn').text(result[0].isbn);
		 		 	$('#checkout-copynumber').text(result[0].copyNumber);
		 		 	$('#checkout-checkoutdate').text(Date()); // CURDATE()
		 		 	$('#checkout-returndate').text(result[0].returnDate);
		 			$('#checkout-content').show();
			 	}
			 	
			},
			error: function(xhr, status, error) {
				$("#checkout-form").addClass("error");
				$("#checkout-error-header").text("Error");
				$("#checkout-error-body").text("Invalid IssueID");
			}
		});
	});

	// return screen
	$('#return-content').hide();
	$('#return-message').hide();
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
			 	if(result.length) {
		 		 	$('#return-form').removeClass("error");
		 		 	$('#return-username').text(result[0].username);
		 		 	$('#return-isbn').text(result[0].isbn);
		 		 	$('#return-copynumber').text(result[0].copyNumber);
		 			$('#return-content').show();
		 			if ($('#return-damaged').hasClass("checked")) {
		 				$('#return-form').removeClass("error");
		 				$('#return-message').show();
		 				$('#return-message').removeClass("positive");
		 				$('#return-message').addClass("warning");
		 				$("#return-message-header").text("Book has been damaged");
		 				$("#return-message-body").html("<a href='/lostdamaged'>Click here</a> to proceed to the damaged books screen.");
		 			} else {
		 				$('#return-form').removeClass("error");
		 				$('#return-message').show();
		 				$('#return-message').removeClass("warning");
		 				$('#return-message').addClass("positive");
		 				$("#return-message-header").text("Success");
		 				$("#return-message-body").text("Book returned safely");
		 			}
			 	} else {
			 		$('#return-message').hide();
			 		$("#return-form").addClass("error");
			 		$("#return-error-header").text("Error");
			 		$("#return-error-body").text("Invalid IssueID");
			 	}
			},
			error: function(xhr, status, error) {
				$('#return-message').hide();
				$("#return-form").addClass("error");
				$("#return-error-header").text("Error");
				$("#return-error-body").text("Invalid IssueID");
			}
		});
	});

	// lostdamaged screen
	$('#penalty-submit-btn').click(function() {
		$.ajax({ 
			url: "db/penalty",
			data: {
				isbn: $('#penalty-isbn').val(),
				copyNumber: $('#penalty-copyNumber').val(),
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

	// damaged books report
	// NOTE: There are no damaged books so we'll have to retest this.
	$('#damaged-content').hide();
	$('#damaged-btn').click(function() {
		$.ajax({
			url: "db/damagedBooksReport",
			data: {
				month: $('#damaged-month').val(),
				subject1: $('#damaged-subject1').val(),
				subject2: $('#damaged-subject2').val(),
				subject3: $('#damaged-subject3').val()
			},
			 success: function(result){
			 	$('#damaged-form').removeClass("error");
			 	$('#damaged-content').show();
				$("#search-table").append(
					"<tr>" +
					"<td>" + months[result.month] + '</td>' +
					"<td>" + result.subject + '</td>' +
					"<td>" + result.count + '</td>' +
					"</tr>"
				);
				$("#search-table").append(
					"<tr>" +
					"<td>" + months[result.month] + '</td>' +
					"<td>" + result.subject + '</td>' +
					"<td>" + result.count + '</td>' +
					"</tr>"
				);
				$("#search-table").append(
					"<tr>" +
					"<td>" + months[result.month] + '</td>' +
					"<td>" + result.subject + '</td>' +
					"<td>" + result.count + '</td>' +
					"</tr>"
				);
				$('.ui.checkbox').checkbox();
			},
			error: function(xhr, status, error) {
				console.log(error.message);
				$("#damaged-form").addClass("Error");
				$("#damaged-error-header").text(error.status);
				$("#damaged-error-body").text(error.message);
			}
		});
	});
	
	// popular books report
	$.ajax({
		url: "db/popularBooksReport",
		 success: function(result){
		 	result.forEach(function(item) {
		 		$("#popular-table").append(
		 			"<tr>" +
		 			"<td>" + months[item.month] + '</td>' +
		 			"<td>" + item.title + '</td>' +
		 			"<td>" + item.count + '</td>' +
		 			"</tr>"
		 		);
		 	});
		},
		error: function(xhr, status, error) {
			alert("popular book report failed");
		}
	});

	// frequent user report
	$.ajax({
		url: "db/frequentUserReport",
		 success: function(result){
		 	result.forEach(function(item) {
		 		$("#frequent-table").append(
		 			"<tr>" +
		 			"<td>" + months[item.month] + '</td>' +
		 			"<td>" + StudentAndFaculty.firstname +
		 			" " + StudentAndFaculty.lastname + '</td>' +
		 			"<td>" + item.count + '</td>' +
		 			"</tr>"
		 		);
		 	});
		},
		error: function(xhr, status, error) {
			alert("frequent user report failed");
		}
	});

	// popular subjects report
	$.ajax({
		url: "db/popularSubjectReport",
		 success: function(result){
		 	result.forEach(function(item) {
		 		$("#popularSubjects-table").append(
		 			"<tr>" +
		 			"<td>" + months[item.month] + '</td>' +
		 			"<td>" + item.subject + '</td>' +
		 			"<td>" + item.count + '</td>' +
		 			"</tr>"
		 		);
		 	});
		},
		error: function(xhr, status, error) {
			alert("popular subject report failed");
		}
	});

});