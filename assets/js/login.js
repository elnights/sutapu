/******************************************************************************/
SUTAPU.userSign = function(form){
  var url, values = {}, i, array, method;
    if($(form).attr('id') === 'signup_form'){
    url = '/user/create';
    method = 'POST';
  } else if($(form).attr('id') === 'login_form'){
    url = '/auth/local';
    method = 'GET';
  } else {
    return;
  }
  array = $(form).serializeArray();
  for(i in array){
    values[array[i].name.replace('login_', '').replace('signup_', '')] = array[i].value;
  }
  
  SUTAPU.DoRequestByFunction(method, url, values, function(data){
    if(data && data.id){
      if(method==='GET'){
        window.location = '/';
        return;
      }
      url = '/auth/local';
      method = 'GET';
      SUTAPU.DoRequestByFunction(method, url, values, function(data){
        if(data && data.id){
          window.location = '/';
        }
      });
    }
  });
}
/******************************************************************************/

/******************************************************************************/
$(document).ready(function(){
  $('#login_form').validate({
    rules: {
      login_email: {
        required: true,
        email: true
      },
      login_password: {
        minlength: 6,
        required: true
      }
    },
    highlight: function(element) {
	$(element).closest('.control-group').removeClass('success').addClass('error');
    },
    success: function(element) {
      element
	.text('OK!').addClass('valid')
	.closest('.control-group').removeClass('error').addClass('success');
    }, submitHandler: SUTAPU.userSign
  });
  
  $('#signup_form').validate({
    rules: {
      signup_email: {
        required: true,
        email: true
      },
      signup_password: {
        minlength: 6,
        required: true
      },
      signup_displayname:{
        minlength: 4,
        required: true
      }
    },
    highlight: function(element) {
	$(element).closest('.control-group').removeClass('success').addClass('error');
    },
    success: function(element) {
      element
	.text('OK!').addClass('valid')
	.closest('.control-group').removeClass('error').addClass('success');
    }, submitHandler: SUTAPU.userSign
  });
  
  $('.change-form-button').click(function(){
    var thisForm = $(this).closest('.login-form'),
        otherForm = $('.login-form').not($(this).closest('.login-form'));
    thisForm.animate({'marginTop': -500}, 700, function(){
      thisForm.hide();
      otherForm.css('marginTop',-500).show().animate({'marginTop': 0}, 700);
    });
  });
});