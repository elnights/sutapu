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
  
  (function(ko) {
    //create an object that holds our bindings
    var bindings = {
      ko_logout: function() {
        return { 
          click: function(){
            console.log(this, arguments);
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
          value: this.user().displayName
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
      }
      
      
    };

    ko.bindingProvider.instance = new ko.classBindingProvider(bindings);

    var ViewModel = function(cfg) {
        var model = this;
        
        this.user = ko.observable({});
        this.userName = ko.observable(cfg.name);
        this.defaultAvatar = 'http://i061.radikal.ru/1003/0a/f9adca20b56d.jpg';
        
        this.showPage = function(page){
          var pages = $('.pages');
          pages.filter('.current-page').fadeOut(500, function(){
            pages.filter('.' + page).fadeIn(500).addClass('current-page');
          }).removeClass('current-page');
        };
        
        SUTAPU.DoGetByFunction('/auth/currentUser', {}, function(data){
          model.user(data);
          model.userName(data.displayName.capitalize());
        });
        console.log(cfg);
    };

    SUTAPU.viewModel = new ViewModel({name: 'User'});
    ko.applyBindings(SUTAPU.viewModel, document.getElementById("body"));
  })(ko);
});
