$(function () {
    const storedVal = localStorage.getItem('text-type');
    if (storedVal) {
        $('#text-type').val(storedVal);
        $('.text-type-value').html(storedVal);
    }
})

$('#detect').on('click', function () {
    const dropdownValue = $('#text-type').val();

    if (dropdownValue === CODE) {
        updateSectionCode();
    } else if (dropdownValue === README) {
        updateSectionReadme();
    }
});

$('#edit').on('click', function () {
    $('#highlighted-result').addClass('hidden');
    $('.result-breakdown').addClass('hidden');
    $('.result-breakdown > div').addClass('hidden')
    $('.global-scores').addClass('hidden');
    $('#code').removeClass('hidden');
    $('#highlighting-content').parent().removeClass('hidden');
    $('#edit').addClass('hidden');
    $('#detect').removeClass('hidden');
});

$('#text-type').on('change', function () {
    const dropdownValue = $('#text-type').val();
    $('.text-type-value').html(dropdownValue);
    $('#edit').trigger('click');

    localStorage.setItem('text-type', dropdownValue);
})