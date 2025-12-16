$(function () {
    const textarea = $('#code');
    const pre = $('pre');
    const code = $('#highlighting-content');
    const highlightedResult = $('#highlighted-result');
    const lineNumbers = $('.line-numbers');

    window.update = function () {
        let text = textarea.val();

        if (text[text.length - 1] === "\n") {
            text += " ";
        }

        code.text(text);
        Prism.highlightElement(code[0]);
        updateLineNumbers(text);
    }

    window.updateLineNumbers = function (text) {
        const lines = text.split('\n').length;
        let linesHtml = '';
        for (let i = 1; i <= lines; i++) {
            linesHtml += i + '<br>';
        }
        lineNumbers.html(linesHtml);
    }

    window.syncScroll = function () {
        const scrollTop = textarea.scrollTop();
        const scrollLeft = textarea.scrollLeft();

        pre.scrollTop(scrollTop);
        pre.scrollLeft(scrollLeft);
        lineNumbers.scrollTop(scrollTop);
    }

    window.syncResultScroll = function () {
        const scrollTop = highlightedResult.scrollTop();
        lineNumbers.scrollTop(scrollTop);
    }

    textarea.on('input', window.update);
    textarea.on('scroll', window.syncScroll);
    highlightedResult.on('scroll', window.syncResultScroll);

    window.update();
});

$('#language').on('change', function () {
    window.update();
});
