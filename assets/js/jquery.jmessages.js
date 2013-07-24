(function($) 
{
	$.jmessage = function(header, message, lifetime, class_name) 
	{
		// получаем стек
		var stack_box = $('#jm_stack_box');
		
		// если его нет, тогда создаём
		if(!$(stack_box).length)
		{
			stack_box = $('<div id="jm_stack_box"></div>').prependTo(document.body);
		}

		// создаем контейнер сообщения
		var message_box = $('<div class="jm_message ' + class_name + '"><h3>' + header + '</h3>' + message + '</div>');

		// эффектно показываем
		$(message_box).css('opacity', 0).appendTo('#jm_stack_box').animate({opacity: 1}, 300);
		
		// устанавливаем триггер, при клике закрывать сообщение
		$(message_box).click(function()
		{
			$(this).animate({opacity: 0}, 300, function()
			{
				$(this).remove();
			});
		});

		// устанавливаем таймер на закрытие сообщения
		if((lifetime = parseInt(lifetime)) > 0)
		{	
			setTimeout(function()
			{
				$(message_box).animate({opacity: 0}, 300, function()
				{
					$(this).remove();
				});
			}, 
			lifetime);
		}
	};
})(jQuery); 
