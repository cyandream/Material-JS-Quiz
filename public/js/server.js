var _SERVER = (function () {
    return {
        mockSubmit: function(form) {
            var deferred = $.Deferred();
            setTimeout(function() {
                if(form === 'fail-me')  // either validation failures or save failures could be returned here
                    deferred.reject('failure:5ms delay');
                else
                {
                    var data='';
                    $(".quiz-question").load('../../data/question.json', data, function(result) {
                        console.log(result);
                    });
                    deferred.resolve(data);
                }
            }, 1000);
            return deferred.promise();
        }
    };
}());
