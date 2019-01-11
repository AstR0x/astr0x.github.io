$(document).ready(function() {
    var display = $('.display__input');
    var key = $('.button-block button');
    var button = $('.button-block__button')
    var clear = $('.button-block__button_clear');
    var equal = $('.button-block__button_equal');
    var sqrt = $('.button-block__button_sqrt');
    var percent = $('.button-block__button_percent');
    var squaring = $('.button-block__button_squaring');
    var cubing = $('.button-block__button_cubing');
    var remove = $('.button-block__button_remove');

    key.each(function() {
        var current = $(this).attr('value');
        $(this).text(current);
    })

    button.click(function() {
        display.val(display.val() + $(this).val());
    })

    clear.click(function() {
        display.val('');
    })

    sqrt.click(function() {
        var result = Math.sqrt(eval(display.val())).toFixed(5);
        display.val(result);
    })

    percent.click(function() {
        var result = eval(display.val());
        display.val(result * 0.01);
    })

    squaring.click(function() {
        display.val(Math.pow(eval(display.val()), 2));
    })

    cubing.click(function() {
        display.val(Math.pow(eval(display.val()), 3));
    })

    remove.click(function() {
        var newVal = display.val().slice(0, display.val().length - 1);
        display.val(newVal);
    })

    equal.click(function() {
        var result = eval(display.val());
        result = (result.toFixed(5));
        result = result.toString();
        result = delNull(result);
        display.val(result);
    })

    function delNull(num) {
        var i = num.length - 1;
        while (num[i] == '0') {
            i--;
        }
        if (num[i] == '.') {
            return num.slice(0, i)
        }
        return num.slice(0, i + 1);
    }

})