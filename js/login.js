jQuery(document).ready(function()
{

    $('.login').css("display", "none");
    $('.registration').css("display", "none");

    $('.main_menu a:eq(0)').on('click', function(event)
    {
        event.preventDefault();
        $('.login').slideToggle();

    });
    $('.main_menu a:eq(1)').on('click', function(event)
    {

        event.preventDefault();
        $('.registration').slideToggle();

    });

    $('.button_login').on('click', function(event)
    {
        event.preventDefault();
        var input1 = $('.login input:eq(0)').val();
        var input2 = $('.login input:eq(1)').val();

        if (input1 == "" || input2 == "")
        {
            alert("Введите логин и пароль");
        }
        else
        {
            $.ajax(
            {
                url: "js/users.json",
                dataType: "json",
                success: function(data)
                {

                    if (JSON.parse(localStorage.getItem("users")) == null)
                    {
                        localStorage.setItem("users", JSON.stringify(data));
                    }
                    else if (data.length >= JSON.parse(localStorage.getItem("users")).length)
                    {
                        localStorage.setItem("users", JSON.stringify(data));
                    }

                }
            });

            var users = JSON.parse(localStorage.getItem("users"));
            for (var i = 0; i < users.length; i++)
            {
                var count = 0;
                var flag = 0;
                if (users[i].login == input1)
                {
                    if (users[i].password == input2)
                    {
                        alert("Вход выполнен под логином " + users[i].login);

                        $(".login_name").text(users[i].login)
                        localStorage.setItem("user", users[i].login);
                        $('.login').slideUp();
                        count = i;
                        flag = 1;
                        break;

                    }
                }

            }

            if (flag == 0)
            {
                alert("Проверьте правильность пароля");
            }

        }

    });

    $('.button_registration').on('click', function(event)
    {

        event.preventDefault();

        var input1 = $('.registration input:eq(0)').val();
        var input2 = $('.registration input:eq(1)').val();
        if (input1 == "" || input2 == "")
        {
            alert("Введите логин и пароль");
        }
        else
        {

            $.ajax(
            {
                url: "js/users.json",
                dataType: "json",
                success: function(data)
                {


                    var users = data
                    var count = 0;
                    var flag = 0;
                    for (var i = 0; i < users.length; i++)
                    {

                        if (users[i].login == input1)
                        {
                            flag = 1;
                        }

                    }
                    if (flag == 1)
                    {
                        alert("Такой логин существует")
                    }
                    else
                    {
                        users.push(
                        {
                            "login": input1,
                            "password": input2

                        });

                        var sObj = JSON.stringify(users);
                        alert("Успешно зарегистрировано")
                        $('.registration').slideUp();
                        localStorage.setItem("users", sObj);
                        $.post('2.php',
                        {
                            a: sObj
                        }, function(data) {});

                    }

                }
            });

        }

    });

});