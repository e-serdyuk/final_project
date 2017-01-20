jQuery(document).ready(function() {
    function scroll(scroll) {
        $(scroll).on("click", function(event) {
            event.preventDefault();
            var id = $(this).attr('href'),
                top = $(id).offset().top;
            $('body,html').animate({
                scrollTop: top
            }, 1500);

        });
    }
    $('.search_div_float button').on('click', function() {

        var val = $(".search input").val();
        if (val == "") alert("Введите строку в поиск")
        else {
            window.location.href = "lots.html?id=all&val=" + val;
        }
    });
    function nextSlide() {
        slides[currentSlide].className = 'slide';
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].className = 'slide showing';
    }
    scroll(".main_menu a:first")
    scroll(".main_menu a:eq(1)")
    scroll(".main_menu a:eq(2)")

    var slides = document.querySelectorAll('#slides .slide');
    var currentSlide = 0;
    var slideInterval = setInterval(nextSlide, 5000);

});