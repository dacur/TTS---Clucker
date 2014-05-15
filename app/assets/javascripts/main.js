$(document).ready(function(){
	// SHOWING MESSAGE FOR AJAX LOGOUT
	var lo = getQueryVariable("loggedout");
	if (lo == "true")
		ShowSuccess("Thanks for logging out");

	if ($('#hdnID').val() !== '') {
		$('#btnShowLogin').hide();
		$('#btnLogout').show();
	}
	else {
		$('#btnLogout').hide();
		$('#btnShowLogin').show();
	}

	$('#btnStart').on('click', function(){

		$('#overlay').fadeIn('fast', function(){
			var d = $('#dialogSignup');
			d.show();
			d.animate({
				top: '30px'
			}, 500, function(){
				$('#txtFirst').focus();
			});
		});
	});

	$('#btnSignupCancel').on('click', function(){
		HideDialog();
	});

	$('#txtConfirm').keyup(function(e){
		if (e.keyCode == 13)
			SendSignup();
	});

	$('#btnSignup').on('click', function(){
		SendSignup();
	});

	$('#btnShowLogin').on('click', function(){
		$('#overlay').fadeIn('fast', function(){
			var d = $('#dialogLogin');
			d.show();
			d.animate({
				top: '30px'
			}, 500, function(){
				$('#txtLoginEmail').focus();
			});
		});
	});

	$('#btnLoginCancel').on('click', function(){
		HideDialog();
	});

	$('#txtLoginPassword').keyup(function(e){
		if (e.keyCode == 13)
			Login();
	});

	$('#btnLogin').on('click', function(){
		Login();
	});

	$('#txtCluck').keyup(function(e){
		if (e.keyCode == 13)
			SaveCluck();
	});

	$('#btnSaveCluck').on('click', function(){
		SaveCluck();
	});

	$('#txtCluck').keypress(function(e){
		var txt = $('#txtCluck').val();
		var max = 142;

		if (txt.length >= max) {
			e.preventDefault();
			return;
		}

		var remaining = max - txt.length - 1;
		$('#cluckCounter').html(remaining + ' characters left!');
	});

	// USED ONLY FOR AJAX LOGOUT
	$('#btnLogout').on('click', function(){
		$.ajax({ url:'/api/logout'}).done(
			function(){
				window.location = '/?loggedout=true';
			});
	});
});

function HideDialog(){
	var d = $('.dialog');
	d.animate({
		top: '-500px'
	}, 500, function(){
		d.hide();
		$('#overlay').fadeOut('fast');
	});
}

function Login(){
	var email = $('#txtLoginEmail').val();
	var password = $('#txtLoginPassword').val();

	if (email === '' || password === '')
		return;

	$.ajax({
		url: '/api/login',
		type: 'POST',
		data: { email: email, password: password}
	}).done(function(data){
		HideDialog();

		if (data === null)
			ShowError("Hmm...we couldn't log you in. Might want to try again.");
		else
			window.location = '/main/cluck';
	});
}

function SaveCluck(){
	var txt = $('#txtCluck').val();

	if (txt === '') {
		ShowError('An empty cluck is a bad cluck...');
		return;
	}

	$.ajax({
		url: '/api/savecluck',
		type: 'POST',
		data: { text: txt }
	}).done(function(newCluck){
		var old = $('#showClucks').html();
		var html = '<div class="cluck">';
		html += '<div class="item text">' + newCluck.text + '</div>';
		html += '<div class="item name">' + newCluck.user_name + '</div>';
		html += '<div class="item date">' + moment(newCluck.post_date).format("MMM D, h:mm A ") + '</div>';
		html += '</div>';

		$('#showClucks').html(html + old);
		$('#txtCluck').val('');
		$('#cluckCounter').html('142 characters left!');
	});
}

function SendSignup(){
	var first = $('#txtFirst').val();
	var last = $('#txtLast').val();
	var email = $('#txtEmail').val();
	var password = $('#txtPassword').val();
	var confirm = $('#txtConfirm').val();

	if (first === ''){
		ShowError('First names are really important!');
		$('#txtFirst').focus();
		return;
	}

	if (last === ''){
		ShowError('If you don\'t have a last name we have to call you Pinky...you don\'t want that!');
		$('#txtLast').focus();
		return;
	}

	if (email === '' || !ValidateEmail(email)){
		ShowError('Email addresses are the key to the soul. Can we have yours?');
		$('#txtEmail').focus();
		return;
	}

	if (password === '') {
		ShowError('You kinda need a password');
		$('#txtPassword').focus();
		return;
	}

	if (password != confirm) {
		ShowError('Your passwords don\'t match');
		$('#txtPassword').focus();
		return;
	}

	$.ajax({
		url: '/api/savesignup',
		type: 'POST',
		data: { first: first, last: last, email: email, password: password}
	}).done(function(data){
		if (data === null) {
			ShowError('Oops...looks like we already have user with that email.');
			return;
		}

		HideDialog();

		ShowSuccess('Thanks for signing up ' + data.first + '!');
	});
}

function ShowError(text) {
    $('#error').html(text);
    $('#error').show();
    $('#error').animate({ bottom: '0' }, 500);

    setTimeout(function () {
        $('#error').animate({ bottom: '-50px' }, 500,
            function () {
                $('#error').hide();
            });
    }, 6000);
}

function ShowSuccess(text) {
    $('#success').html(text);
    $('#success').show();
    $('#success').animate({ bottom: '0' }, 500);

    setTimeout(function () {
        $('#success').animate({ bottom: '-50px' }, 500,
            function () {
                $('#success').hide();
            });
    }, 4000);
}

function ValidateEmail(value) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(value))
        return (true);

    return (false);
}

// USED ONLY TO SHOW A MESSAGE AFTER AJAX LOGOUT
function getQueryVariable(variable)
{
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
}