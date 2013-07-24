SUTAPU.DoRequestByFunction = function(method,url,data,fu)
{
    var request = $.ajax({
            url: url,
            type: method,
            data: data
    });

    request.done(function(msg){
        fu(msg);
        data = null;
    });

    request.fail(function(jqXHR, textStatus){
        data = null;
        console.log('error', jqXHR);
        $.jmessage('Error!', ((jqXHR.responseJSON && jqXHR.responseJSON.description) || "Request failed with code " + jqXHR.status) , 3000, 'jm_message_error');
    });
}
/******************************************************************************/

/******************************************************************************/
SUTAPU.DoPostByFunction = function(url, data, fu){
    SUTAPU.DoRequestByFunction('POST', url, data, fu);
}
/******************************************************************************/

/******************************************************************************/
SUTAPU.DoGetByFunction = function(url, data, fu){
    SUTAPU.DoRequestByFunction('GET', url, data, fu);
}
/******************************************************************************/

/******************************************************************************/
SUTAPU.DoPostByMess = function(url, data, successText, errorText)
{
    var fumess = function(msg)
    {
        if(msg.error){$.jmessage('Error!', errorText, 3000, 'jm_message_error');}
        else
        {
            if(msg.ok){$.jmessage('Success', successText, 3000,'jm_message_success');}
            else{console.log(msg);}    
        }
    }
    SUTAPU.DoPostByFunction(url, data, fumess);
}
/******************************************************************************/    