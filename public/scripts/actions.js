$(document).ready(function(){
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
			}
		});
	});
});