jQuery(document).ready(function()
{
    function Data()
    {
        this.data = {};
        var temp = [];


        this.initialize = function()
        {


            $.ajax(
            {
                url: "js/lots.json",
                dataType: "json",
                success: function(data)
                {
                    localStorage.setItem("objectN", JSON.stringify(data));

                }
            });


            this.data = JSON.parse(localStorage.getItem("objectN"));

            if (this.data == null)
            {
                location.reload();
            }


        }
        this.update = function(name, price, photo, description, category, time, photo1, photo2)
        {
            this.data.push(
            {
                "name": name,
                "price": price + " грн",
                "photo": photo,
                "photo1": photo1,
                "photo2": photo2,
                "bet": "",
                "description": description,
                "time": time,
                "category": category
            });
            var sObj = JSON.stringify(this.data)
            localStorage.setItem("objectN", sObj);
            $.post('1.php',
            {
                a: sObj
            }, function(data) {});

        };
        this.search = function(s)
        {
            s = decodeURIComponent(s);
            s1 = s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();

            var Arr = this.data.filter(function(number)
            {
                return number.name.indexOf(s) >= 0 || number.name.indexOf(s1) >= 0;
            });
            localStorage.setItem("object", JSON.stringify(Arr));
            json.print_object();

        };

        function print(data)
        {
            for (var i = 0; i < data.length; i++)
            {
                date = Math.floor((new Date(data[i].time).getTime() - Date.now()) / 86400000) + " дней";
                if (parseFloat(date) < 0)
                {
                    date = "Завершен";
                }
                $('.lot').append('<div class="content lots"><div class="name"><a href=""> ' + data[i].name + '</a></div> <img class="name" src=' + data[i].photo + '><div class="price"><b>Цена:</b>' + data[i].price + '</div>  <div class="time"><b>Времени осталось:</b>' + date + '</div>         </div>');
            }
        };
        this.print_object = function()
        {
            $('.lot').html(" ");
            var object = JSON.parse(localStorage.getItem("object"));
            print(object);


        };

        this.printall = function()
        {

            print(this.data);
            localStorage.setItem("object", JSON.stringify(this.data));
        };

        this.update_cat = function(n)
        {

            for (i = 0; i < this.data.length; i++)
            {
                var date;
                if (this.data[i].category == n)
                {
                    date = Math.floor((new Date(this.data[i].time).getTime() - Date.now()) / 86400000) + " дней";
                    if (parseFloat(date) < 0)
                    {
                        date = "Завершен";
                    }
                    $('.lot').append('<div class="content lots"><div class="name"><a href=""> ' + this.data[i].name + '</a></div> <img class="name" src=' + this.data[i].photo + '><div class="price"><b>Цена:</b>' + this.data[i].price + '</div>  <div class="time"><b>Конец аукциона через:</b>' + date + '</div>         </div>');


                    temp.push(this.data[i]);
                }

            }
            localStorage.setItem("object", JSON.stringify(temp));
        };

    };

    function timeFormat(d)
    {
        var sec = d / 1000;
        day = Math.floor(sec / 86400);
        hours = Math.floor(sec / 3600 % 24);
        minutes = Math.floor(sec / 60 % 60);
        if (d > 0)
        {
            return day + " дней " + hours + " часов " + minutes + " минут";
        }
        else return "Аукцион завершен"

    }

    function pagination()
    {
        pageSize = 6;

        showPage = function(page)
        {
            $(".content").hide();
            $(".content").each(function(n)
            {
                if (n >= pageSize * (page - 1) && n < pageSize * page)
                    $(this).show();
            });
        }
        showPage(1);
        $("#pagin li a").click(function(e)
        {
            e.preventDefault();
            $("#pagin li a").removeClass("current");
            $(this).addClass("current");
            showPage(parseInt($(this).text()))
        });

    }


    function calc_pages()
    {
        $('#pagin').html("");
        var arr = (JSON.parse(localStorage.getItem("object"))).length;
        var count = 6;
        var n = Math.floor(arr / count);
        if (arr % count != 0) n++;
        for (i = 1; i <= n; i++)
        {
            if (i == 1)
            {
                $('#pagin').append(" <li><a class='current' href='#'>" + i + "</a></li>")
            }
            else
            {
                $('#pagin').append(" <li><a href='#'>" + i + "</a></li>");
            }
        }
    }

    function rewrite(data_t, int, bet)
    {
        var arr = JSON.parse(localStorage.getItem("objectN"));
        for (var i = 0; i < arr.length; i++)
        {
            if (arr[i].name == data_t.name)
            {
                arr[i].price = int + " грн";
                arr[i].bet = bet;
            }
        }
        localStorage.setItem("objectN", JSON.stringify(arr));
        $.post('1.php',
        {
            a: JSON.stringify(arr)
        }, function(data) {

        });
    }

    var json = new Data();
    json.initialize();

    $('.lot').on('click', '.name', function(event)
    {
        event.preventDefault();
        var count = $(this).parent().index();
        window.location.href = "tip.html?id=" + count;

    });

    $('.filter_price').on('click', function(event)
    {
        $('.add').slideToggle("slow");
    });
    $('.filter_categories').on('click', function(event)
    {
        window.location.href = "lots.html?id=" + $('.input_categories input:checked').val();
    });
    $('.add_button').on('click', function(event)
    {
        event.preventDefault();
        var name = $('form input:eq(0)').val();
        var price = $('form input:eq(1)').val();
        var photo = $('form input:eq(2)').val();
        var description = $('textarea').val();
        var category = $('select option:selected').val();
        var time = $('form input:eq(3)').val();
        var photo1 = $('form input:eq(4)').val();
        var photo2 = $('form input:eq(5)').val();
        if (name == "" || price == "" || time == "" || photo == "")
        {
            alert("Проверьте поля на заполнение");
            $('.add').slideToggle("slow");
        }
        else
        {
            json.update(name, price, photo, description, category, time, photo1, photo2);
            $('.lot').html(" ");
            json.printall();
            calc_pages();
            pagination();
            $('.add').css("display", "none");
        }

    });

    var id_category = window.location.href.split("?")[1].split("=")[1];
    if (id_category == 'money')
    {
        json.update_cat(id_category);
        calc_pages();
        pagination();
        var crumbs = $('.breadcrumbs').html();
        $('.breadcrumbs').html(crumbs + "/" + "<a href='lots.html?id=money'>Монеты</a>");
        localStorage.setItem("breadcrumbs", $('.breadcrumbs').html());
    }
    if (id_category == 'marki')
    {
        json.update_cat(id_category);
        calc_pages();
        pagination();
        var crumbs = $('.breadcrumbs').html();
        $('.breadcrumbs').html(crumbs + "/" + "<a href='lots.html?id=marki'>Марки</a>");
        localStorage.setItem("breadcrumbs", $('.breadcrumbs').html());
    }
    if (id_category == 'picture')
    {
        json.update_cat(id_category);
        calc_pages();
        pagination();
        var crumbs = $('.breadcrumbs').html();
        $('.breadcrumbs').html(crumbs + "/" + "<a href='lots.html?id=picture'>Картинки</a>");
        localStorage.setItem("breadcrumbs", $('.breadcrumbs').html());
    }
    if (id_category == 'all')
    { 
        json.printall();
        calc_pages();
        pagination();
        var crumbs = $('.breadcrumbs').html();
        $('.breadcrumbs').html(crumbs + "/" + "<a href='lots.html?id=all'>Все лоты</a>");
        localStorage.setItem("breadcrumbs", $('.breadcrumbs').html());
    }
    if (id_category == 'all&val')
    {
        var search = window.location.href.split("?")[1].split("=")[2];
        json.search(search);
    }



    var id_detail = window.location.href.split("?")[1].split("=")[1];
    var data_temp = JSON.parse(localStorage.getItem("object"));

    if (localStorage.getItem("user") == null)
    {
        $(".login_name").text("")
    }
    else
    {
        $(".login_name").text(localStorage.getItem("user"))
    }
    $('.filter_up').on('click', function()
    {

        data_temp.sort(compare);

        function compare(A, B)
        {
            return parseFloat(A.price) - parseFloat(B.price);
        }
        localStorage.setItem("object", JSON.stringify(data_temp));
        json.print_object();
        calc_pages();
        pagination();

    });
    $('.filter_down').on('click', function()
    {
        data_temp.sort(compare);

        function compare(A, B)
        {
            return parseFloat(B.price) - parseFloat(A.price);
        }
        localStorage.setItem("object", JSON.stringify(data_temp));
        json.print_object();
        calc_pages();
        pagination();

    });
    $('.filter_show').on('click', function()
    {
        var val1 = $(".filter input:first").val();
        var val2 = $(".filter input:eq(1)").val();
        var Arr = data_temp.filter(function(number)
        {
            return (parseFloat(number.price) > val1) && (parseFloat(number.price) < val2);
        });
        localStorage.setItem("object", JSON.stringify(Arr));
        json.print_object();
        calc_pages();
        pagination();

    });
    var string = window.location.href.split("?")[0];
    var detail_string = string.slice(string.length - 8, string.length);
    if (detail_string == "tip.html")
    {
        var date_detail = timeFormat(new Date(data_temp[id_detail].time).getTime() - Date.now());
        $(".lot_about").append('<div class="container"><h1 class="name_detail">' + data_temp[id_detail].name + '</h1><div class="container_detail"><div class="images"><img class="img_detail" src=' + data_temp[id_detail].photo + '><img class="additional_photo" src=' + data_temp[id_detail].photo1 + '><img class="additional_photo additional_photo_last" src=' + data_temp[id_detail].photo2 + '></div><div class="right_detail"> <div class="price_detail"><b>Актуальная цена </b><span class="price">' + data_temp[id_detail].price + '</span></div> <input class="input_bet" type="number"><button class="bet">Сделать ставку</button> <div class="time_detail"><b>Конец аукциона: </b><span class="time">' + data_temp[id_detail].time + '</span></div>    <div class="time_detail"><b>Осталось до конца аукциона:<br></b><span class="tme">' + date_detail + '</span></div> <p class="p_phone">Введите телефон <input class="input_phone" type="number"></p> <p class="bets">' + data_temp[id_detail].bet + '</p>          </div> </div> <div class="description_detail"><h2>Описание</h2> ' + data_temp[id_detail].description + '</div> <a class="sharing_vk" href="#"> Share в VK</a> <a class="sharing_facebook" href="#"> Share в Facebook</a>     </div>');
        if (new Date(data_temp[id_detail].time).getTime() - Date.now() < 0)
        {
            $(".bet").css('display', 'none');
            $(".input_bet").css('display', 'none');
            $(".price_detail").css('display', 'none');
            $('.input_phone').css('display', 'none');
            $('.p_phone').css('display', 'none');

        }
        var crumbs = localStorage.getItem("breadcrumbs");
        $('.breadcrumbs').html(crumbs + "/" + data_temp[id_detail].name);
        $(".img_detail").imageLens(
        {
            lensSize: 200
        });
    }
    $('.additional_photo').on('click', function()
    {
        var src = $(this).attr('src');
        var src1 = $('.img_detail').attr('src');
        $('.img_detail').attr('src', src);
        $(this).attr('src', src1);
        $(".undefined").css('backgroundImage', 'url(' + src + ')')

    });
    $('.sharing_vk').on('click', function(event)
    {
        event.preventDefault();
        window.open('https://vk.com/share.php?url=' + window.location.href + window.location.hash + '&title=' + $('.name_detail').text() + '&image=http://' + window.location.hostname + window.location.pathname.split("tip.")[0] + $('.img_detail').attr('src') + '&description=' + $('.description_detail').text())

    });
    $('.sharing_facebook').on('click', function(event)
    {
        event.preventDefault();

        window.open('http://www.facebook.com/sharer.php?s=100&p[url]=' + window.location.href + window.location.hash + '&p[title]=' + encodeURIComponent($('.name_detail').text()) + '&p[images][0]=http://' + window.location.hostname + window.location.pathname.split("tip.")[0] + $('.img_detail').attr('src') + '&p[summary]=' + $('.description_detail').text())

    });
    $('.bet').on('click', function()
    {
        var int = $('.input_bet').val();
        var phone = $('.input_phone').val();
        var user_id=localStorage.getItem("user");
        if(user_id==null){user_id=""}
        var date = new Date();
        var bet = 'Пользователь ' + user_id + ' c телефоном ' + phone + " сделал ставку " + int + " в " + date + "<br>";
        if ((phone == "") || (phone.length != 10))
        {
            alert("Введите верный номер телефона, состоящий из 10 цифр");
        }
        else
        {
            if (Number(int) <= parseFloat(data_temp[id_detail].price))
            {
                alert("Введите сумму больше чем актуальная цена!!!");
            }
            else
            {
                data_temp[id_detail].price = int;
                data_temp[id_detail].bet += bet;
                rewrite(data_temp[id_detail], int, data_temp[id_detail].bet);
                $('span.price').text(int + ' грн');
                $(".bets").html("");
                $(".bets").append(data_temp[id_detail].bet);
                alert("Вы сделали ставку на лот " + data_temp[id_detail].name + " по цене " + data_temp[id_detail].price + " гривен. У вас осталось " + date_detail)
                window.location.href = "lots.html?id=all";

            }
        }
    });

});