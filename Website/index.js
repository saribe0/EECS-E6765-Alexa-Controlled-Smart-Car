AWS.config.region = 'us-east-2';
var apigClient = null;					// https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-generate-sdk-javascript.html


function sendCommand(action, speed) {

  var body = {
    action: action,
    speed: speed
  };

  apigClient.rootPost(null, body).then(function(result) {
     console.log(result);
  }).catch(function(result) {
     console.log(result)
  });
}

$(window).on('load', function() {

  // Incorporate credentials being valid -> Whenever the page is reloaded or a request is about to be made,
  // - check credentials
  // - AWS.config.credentials.get(callback) can be used
  // - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Credentials.html#get-property
  if (window.location.href.includes('?')) {
  	var codeRaw = window.location.href.split('?');
  	var code = codeRaw[1].split('=')[1];
  	console.log(code);
  	sessionId = code;

  	$.ajax({
  		url: "https://picar.auth.us-east-2.amazoncognito.com/oauth2/token",
  		type: 'post',
  		data: {
  			grant_type: 'authorization_code',
  			client_id: '7mdroakrjtl8f6b0q4u20nr9hb',
  		 	code: code,
  		 	redirect_uri: 'https://s3.us-east-2.amazonaws.com/picar-iot/index.html'
  		},
  		headers:{
  			'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + 'N21kcm9ha3JqdGw4ZjZiMHE0dTIwbnI5aGI6b2hnbGw3OGw3bWwyYzBldGVzOXBhZ2FiMnBnNjh1bXNoYWd1M2I3bm1oZmNhZ3NnajBm'
  		},
  		dataType: 'json',
  		success: function(data){
  			console.log(data);

  			AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  				IdentityPoolId: 'us-east-2:3b15058b-0bd4-41e5-a2cb-897f954f0e49',
  				Logins: {
  					'cognito-idp.us-east-2.amazonaws.com/us-east-2_otu8ZCxdv': data.id_token
  				}
  			})
  			AWS.config.credentials.get(function(err){
  				if (err) {
  					console.log(err);
            $('#content_inner').hide();
            $('#logout').hide();
  					$('.login').show().css('display', 'flex');
  				}
  				else {
  					console.log('Secret: ' + AWS.config.credentials.secretAccessKey);
  					console.log('Access: ' + AWS.config.credentials.accessKeyId);

  					apigClient = apigClientFactory.newClient({
  						accessKey: AWS.config.credentials.accessKeyId,
  						secretKey: AWS.config.credentials.secretAccessKey,
  						sessionToken: AWS.config.credentials.sessionToken,
  						region: AWS.config.region
  					});

  					$('#content_inner').show().css('display', 'block');
  					$('#logout').show().css('display', 'flex');
            $('#login').hide();
  				}
  			});
  		},
  		error: function(data) {
  			console.log(data);
  			$('#content_inner').hide();
        $('#logout').hide();
        $('#login').show().css('display', 'flex');

  		}
  	});
  }
  else {
  	console.log('No code');
  	$('#content_inner').hide();
    $('#logout').hide();
    $('#login').show().css('display', 'flex');
  }
});

$(window).on('load', function() {
  $('#login').click(function() {
		location.href='https://picar.auth.us-east-2.amazoncognito.com/login?response_type=code&client_id=7mdroakrjtl8f6b0q4u20nr9hb&redirect_uri=https://s3.us-east-2.amazonaws.com/picar-iot/index.html'
	});
});

$(window).on('load', function() {
  $('#logout').click(function() {
  		if ( AWS.config.credentials != null) {
  			AWS.config.credentials.clearCachedId();
  			apigClient = null;
        $('#content_inner').hide();
        $('#logout').hide();
        $('#login').show().css('display', 'flex');
  		}
  	});
});

$(window).on('load', function() {

  $('#speed0').click(function() {
  		sendCommand("set_speed", 0);
  });
  $('#speed1').click(function() {
  		sendCommand("set_speed", 20);
  });
  $('#speed2').click(function() {
  		sendCommand("set_speed", 40);
  });
  $('#speed3').click(function() {
  		sendCommand("set_speed", 60);
  });
  $('#speed4').click(function() {
  		sendCommand("set_speed", 80);
  });
  $('#speed5').click(function() {
  		sendCommand("set_speed", 100);
  });
  $('#forward').click(function() {
  		sendCommand("forward", null);
  });
  $('#backward').click(function() {
  		sendCommand("backward", null);
  });
  $('#right').click(function() {
  		sendCommand("turn_right", null);
  });
  $('#left').click(function() {
  		sendCommand("turn_left", null);
  });
  $('#straight').click(function() {
  		sendCommand("turn_straight", null);
  });
  $('#stop').click(function() {
  		sendCommand("stop", null);
  });
});
