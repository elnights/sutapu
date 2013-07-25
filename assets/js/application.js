window.onpopstate = function(e){
  if(e.state){
     console.log(e.state);
  }
};

$(document).ready(function(){
  $('.load-avatar .select-file').change(function(){
    console.log('change');
    $('.update-form .load-avatar').submit();
  });
  
  $('#api_frame_avatar').load(function(){
    console.log($(this).contents().find('body').text());
  });
  
  $('#update_form').submit(function(){
    if($(this).find('.btn-update.btn-disable').length){return;}
    
    var url, values = {}, i, array, method;
    
    url = '/user/update/' + SUTAPU.viewModel.user().id;
    method = 'POST';

    array = $(this).serializeArray();
    
    for(i in array){
      values[array[i].name.replace('update_', '')] = array[i].value;
    }
  
    SUTAPU.DoRequestByFunction(method, url, values, function(data){
      console.log(data);
    });
  }).find('input, textarea').change(function(){
     $('#update_form').find('.btn-update').removeClass('btn-disable');
  });
  
  $('#update_form').submit(function(){
    if($(this).find('.btn-update.btn-disable').length){return;}
    
    var url, values = {}, i, array, method;
    
    url = '/user/update/' + SUTAPU.viewModel.user().id;
    method = 'POST';

    array = $(this).serializeArray();
    
    for(i in array){
      values[array[i].name.replace('update_', '')] = array[i].value;
    }
  
    SUTAPU.DoRequestByFunction(method, url, values, function(data){
      console.log(data);
    });
  }).find('input, textarea').change(function(){
     $('#update_form').find('.btn-update').removeClass('btn-disable');
  });
  
  (function(ko) {
    //create an object that holds our bindings
    var bindings = {
      ko_logout: function() {
        return { 
          click: function(){
            window.location = '/auth/logout'; 
          }
        }
      },
      
      ko_user_name: function(){
        return { 
          text: this.userName 
        }
      },
      
      ko_settings_name: function(){
        return { 
          value: SUTAPU.viewModel.user().displayName
        }
      },
      
      ko_settings_bio: function(){
        return { 
          value: this.user().bio || ''
        }
      },
      
      ko_settings_avatar: function(){
        return { 
          attr : { src: (this.user().avatar || this.defaultAvatar)},
          value: (this.user().avatar || this.defaultAvatar)
        }
      },
      
      ko_open_profile: function(){
        return { 
          click: function(){
            this.showPage('profile');
          }
        }
      },
      
      ko_open_settings: function(){
        return { 
          click: function(){
             this.showPage('settings');
          }
        }
      },
      
      ko_open_users_list: function(){
        return { 
          click: function(){
             this.showPage('users');
          }
        }
      },
      
      ko_open_topics_list: function(){
        return { 
          click: function(){
            this.showPage('topics');
          }
        }  
      },
      
      ko_open_subscriptions_list: function(){
        return { 
          click: function(){
            this.showPage('subscriptions');
          }
        }  
      },
      
      ko_open_post_list: function(){
        return { 
          click: function(){
            this.showPage('messages');
          }
        }
      },
      
      ko_topics: function(){
        return { foreach: this.topics }
      },
      
      ko_other_topics :function(){
         return { foreach: this.otherTopics }
      },
      
      ko_add_topic: function(){
        return { 
          click: function(){
            var name = $('#topicName').val();
            if(!name){return ;}
            SUTAPU.DoPostByFunction('/topic/create', {name: name}, function(data){
              if(data.id){
                var array = [{
                  user: SUTAPU.viewModel.user().displayName.capitalize(),
                  avatar: SUTAPU.viewModel.user().avatar || SUTAPU.viewModel.defaultAvatar,
                  name: name                  
                }];
                SUTAPU.viewModel.topics(array.concat(SUTAPU.viewModel.topics()));
                $('#addTopic').modal('hide');
                $('#topicName').val('');              
              } else {
                $.jmessage('Error!', 'We are sorry, but something went wrong on server!' , 3000, 'jm_message_error');
              }
            });
          }
        }  
      },
      
      ko_last_topics: function(){
        return { foreach: this.lastTopics }
      },
      
      ko_topics_avatar: function(){
        return { attr: { src: this.avatar } }
      },
     
      ko_topics_name: function(context){
        return { 
          text: (this.topic && this.topic.name) || this.name || 'unknown',
          click: function(){
            context.$parent.showPage('mesages',this);
          }
        }
      },

      ko_topics_user: function(context){
        return { 
          text: SUTAPU.viewModel.user().displayName, 
          click: function(){
            context.$parent.showPage('profile',this);
          }
        }
      },
      
      ko_messages_items: function(){
        return { foreach: this.messages }
      },
      
      ko_message_text: function(){
        return { text: this.text || 'No messages...'}
      },

      ko_users: function(){
        return { foreach: this.users }
      },

      ko_users_id: function(){
        return { text: this.id }
      }

    };

    ko.bindingProvider.instance = new ko.classBindingProvider(bindings);

    var ViewModel = function(cfg) {
        var model = this;
        
        this.user = ko.observable({});
        this.userName = ko.observable(cfg.name);
        this.defaultAvatar = 'http://i061.radikal.ru/1003/0a/f9adca20b56d.jpg';
        this.topics = ko.observable([]);
        this.lastTopics = ko.observable([]);
        this.otherTopics = ko.observable([]);
        this.messages = ko.observable([]);
        this.users = ko.observable([]);
        
        this.showPage = function(page, obj){
          obj && console.log(page, obj) || console.log(page);
          var pages = $('.pages').hide();
          $('.nav > li').removeClass('active');
          pages.filter('.current-page').removeClass('current-page').fadeOut(500, function(){
            pages.filter('.' + page).show().fadeIn(500).addClass('current-page');
            $('.nav_' + page).addClass('active');
          });
        };
        
        SUTAPU.DoGetByFunction('/auth/currentUser', {}, function(data){
          model.user(data);
          model.userName(data.displayName.capitalize());
        });
        
        SUTAPU.DoGetByFunction('/topic/mine', {}, function(data){
          var array = [];
          
          for(var i in data){
            data[i].user = (data[i].user && data[i].user.displayName) || model.user.displayName.capitalize();
            data[i].avatar = (data[i].user && data[i].user.avatar) || model.user.avatar || model.defaultAvatar;
            array.push(data[i]);
          }
          model.topics(array);
        });
        
        SUTAPU.DoGetByFunction('/topic', {limit:50, offset:0}, function(data){
          var array = [];
          
          for(var i in data){
            data[i].user = (data[i].user && data[i].user.displayName) || model.user().displayName.capitalize();
            data[i].avatar = (data[i].user && data[i].user.avatar) || model.user().avatar || model.defaultAvatar;
            array.push(data[i]);
          }
          model.lastTopics(array);
          model.otherTopics(array);
        });
        
        SUTAPU.DoGetByFunction('/post/mine', {}, function(data){
          var array = [];
          
          for(var i in data){
            data[i].user = model.user().displayName.capitalize();
            data[i].avatar = model.user().avatar || model.defaultAvatar;
            array.push(data[i]);
          }
          model.messages(array);
          console.log(model.messages());
        });
        
        SUTAPU.DoGetByFunction('/user', {}, function(data){
          var array = [];
          for(var i in data){
            data[i].user = model.user().displayName.capitalize();
            data[i].avatar = model.user().avatar || model.defaultAvatar;
            array.push(data[i]);
          }
          model.users(array);
        });
        
    };

    SUTAPU.viewModel = new ViewModel({name: 'User'});
    ko.applyBindings(SUTAPU.viewModel, document.getElementById("body"));
  })(ko);
});
