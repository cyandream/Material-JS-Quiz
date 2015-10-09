var _QUIZ = (function (){
    return {
        login: function(){
           if (localStorage) {
              // LocalStorage is supported!
              console.log("in localStorage");
              document.getElementById('login-form').addEventListener('submit', function(){
                var name = document.getElementById('name').value;
                // Save name to localStorage
                localStorage.setItem('name', name);
              });
            } else {
              // No support. Use a fallback such as browser cookies or store on the server.
              console.log("No Local Storage");
            }
        },
        welcome: function(){
            console.log("In Welcome");
            var name = localStorage.getItem('name');

            if(name != "undefined" || name != "null") {
                document.getElementById("js-name").innerHTML = "Hello " + name;
            } else {
                document.getElementById('js-name').innerHTML = "Hello!";
            }
        },
        setQuiz: function(){
            console.log('In setQuiz');

            if(localStorage){
                $('input[type="submit"]').on("click", function(){
                    // _Quiz.getQuiz(1);

                });

            }
        },
        getQuiz: function(whichQuiz){
            console.log("in getQuiz");
           $.getJSON('http://www.cyandream.com/Thinkful/Quiz/data/example_2.json', function (data){
                console.log(data.quiz.maths);
                var question = data.quiz.maths.q1;

                source = $('#questions').html();
                template= Handlebars.compile(source);
                $('.quiz-question').html(template(question));

            });
        },
        user: function(){
            console.log("In Play");
            var name = localStorage.getItem('name');

            if(name != "undefined" || name != "null") {
                document.getElementById("js-name").innerHTML =  name;
            } else {
                document.getElementById('js-name').innerHTML = "User";
            }
        },
        callQuiz: function(){
            var userAnswer = $('input[name=question-1]:checked').val();
            $.getJSON('http://www.cyandream.com/Thinkful/Quiz/data/example_2.json', function (data){
                var items = [];
                var correctAnswer = data.quiz.maths.q1.answer;
                console.log("over if " + userAnswer + " vs " + correctAnswer);
                $("#bt-submit").hide();
                 if(correctAnswer === userAnswer){
                  _QUIZ.displayCorrect();
                } else{
                   _QUIZ.displayIncorrect();
                }

            });

        },
        displayCorrect: function(){
            console.log('in correct');
            $("#feedback").html("<a onclick='_QUIZ.loadQuestion()' class='btn-floating btn-large waves-effect waves-light green'><i class='material-icons dp48'>grade</i></a>");
        },
        displayIncorrect: function(){
            console.log('in In correct');
            //todo add one to user settings
            $("#feedback").html("<a onclick='_QUIZ.loadQuestion()'' class='btn-floating btn-large waves-effect waves-light red'><i class='material-icons dp48'>warning</i></a>");
        },
        loadQuestion: function(){
            console.log("in question load");
            $("#feedback").html("");
            $(".quiz-question,.bt-radio").css('visibility', 'hidden')

            //$("#bt-submit").show();
            $("#question-panel").addClass("animate");
        }
    };
})();

