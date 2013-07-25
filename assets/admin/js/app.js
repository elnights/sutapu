window.sutatu = {
  alert: function(type, msg){
    $().toastmessage('showToast',{
      text     : msg,
      position : 'top-right',
      type     : type
    });
  }
};

window.sutatu.auth = {
  initHandlers: function() {
    var _ = this;

    _.elems.signout.click(function() {
      $.ajax({
        url: '/auth/logout',
        dataType: 'JSON'
      }).done(function(res) {
        if(res.result == 'ok'){
          window.location.reload();
        } else {
          _.root.alert('warning', 'Oops...');
        }
      }).fail(function(res) {
        _.root.alert('error', res.responseJSON.code +' '+ res.responseJSON.description);
      });
    });

    _.elems.login.click(function(e) {
      e.preventDefault();
      
      $.ajax({
        url: '/auth/local',
        dataType: 'JSON',
        data: {
          email: _.elems.email.val(),
          password: _.elems.password.val()
        }
      }).done(function() {
        window.location.href = '/admin/';
      }).fail(function(res) {
        _.root.alert('error', res.responseJSON.code +' '+ res.responseJSON.description);
      });
    });
  },
  init: function(){
    this.root = window.sutatu;
    this.elems = {
      signout: $('.signout'),
      login: $('.form-signin .login'),
      email: $('.form-signin input[name=email]'),
      password: $('.form-signin input[name=password]')
    };

    this.initHandlers();
  }
};

window.sutatu.moment = {
  formate: function() {
    var _ = this;

    $.each(_.elems.timesForMoment, function(i, el){
      var time = moment($(el).text()).fromNow();
      $(el).text(time);
    });
  },
  init: function(){
    this.root = window.sutatu;
    this.elems = {
      timesForMoment: $('.for-moment')
    };

    this.formate();
  }
};

window.sutatu.crud = {
  formsSubmit: function(url, data){
    var _ = this;

    $.ajax({
      type: 'POST',
      url: url,
      dataType: 'JSON',
      data: data
    }).done(function(res) {
      if(res.id || res.result){
        window.location.reload();
      } else {
        _.root.alert('warning', 'Oops...');
      }
    }).fail(function(res) {
      _.root.alert('error', res.responseJSON.code +' '+ res.responseJSON.description);
    });
  },

  initHandlers: function() {
    var _ = this;

    _.elems.newUserSubmit.click(function() {
      _.formsSubmit('/user/create', _.elems.newUserForm.serializeArray())
    });

     _.elems.newTopicSubmit.click(function() {
      _.formsSubmit('/topic/create', _.elems.newTopicForm.serializeArray())
    });

    _.elems.newPostSubmit.click(function() {
      _.formsSubmit('/post/create', _.elems.newPostForm.serializeArray())
    });

    _.elems.newSubscriptionSubmit.click(function() {
      _.formsSubmit('/subscription/create', _.elems.newSubscriptionForm.serializeArray())
    });
  },
  init: function(){
    this.root = window.sutatu;
    this.elems = {
      newUserForm: $('#newUser form'),
      newUserSubmit: $('#newUser .submit'),

      newTopicForm: $('#newTopic form'),
      newTopicSubmit: $('#newTopic .submit'),

      newPostForm: $('#newPost form'),
      newPostSubmit: $('#newPost .submit'),

      newSubscriptionForm: $('#newSubscription form'),
      newSubscriptionSubmit: $('#newSubscription .submit')
    };

    this.initHandlers();
  }
};

$(function(){
  window.sutatu.auth.init();
  window.sutatu.moment.init();
  window.sutatu.crud.init();
});