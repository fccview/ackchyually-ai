function updateList(selector, items, className = 'highlight danger') {
    if (items && items.length > 0) {
        const grouped = items.reduce((acc, item) => {
            if (!acc[item.desc]) acc[item.desc] = [];
            acc[item.desc].push({ keyword: item.keyword, weight: item.weight });
            return acc;
        }, {});

        $(selector).removeClass('hidden').find('ul').html(Object.entries(grouped).map(([desc, keywords]) =>
            `<li class="highlighted-list"><strong>${desc}</strong>: ${keywords.map(k => `<span class="${className}">${k.keyword} ${k.weight ? `<small>(${k.weight})</small>` : ''}</span>`).join('')}`
        ).join(''));
    } else {
        $(selector).addClass('hidden');
    }
};

function updateSection(selector, count, text) {
    if (count > 0) {
        $(selector).removeClass('hidden').find('p').text(text);
    } else {
        $(selector).addClass('hidden');
    }
};

function updateSectionCode() {
    const value = $('textarea#code').val();
    let html = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const comments = commentsCounter(value, html);
    html = comments.html;

    const truncation = truncationPatterns(value, html);
    html = truncation.html;

    const conversation = conversations(value, html);
    html = conversation.html;

    const commonPatternsStats = commonCodePatterns(value, html);
    html = commonPatternsStats.html;

    const commonLibraries = commonAIChoices(value, html);
    html = commonLibraries.html;

    const emojis = emojiCounter(value, html);
    html = emojis.html;

    $('#highlighted-result').html(html);
    $('#code').addClass('hidden');
    $('#highlighting-content').parent().addClass('hidden');
    $('#highlighted-result').removeClass('hidden');
    $('#detect').addClass('hidden');
    $('#edit').removeClass('hidden');

    const lines = lineCounter(value) || 1;
    const commentRatio = comments.count / lines;
    const emojiRatio = emojis.count / lines;

    let aiScore = 0;
    aiScore += (truncation.count * 40);
    aiScore += (conversation.count * 35);
    aiScore += (commonPatternsStats.weight);
    aiScore += (commentRatio * 100);
    aiScore += (emojiRatio * 100);
    aiScore += (commonLibraries.count * 2);

    const AIpercentage = parseInt(Math.min(aiScore, 100));

    let likelyhood;
    let commentRatioText;
    let emojiRatioText;

    if (AIpercentage < 15) {
        likelyhood = 'This code was likely reviewed by a human, can\'t tell if it\'s AI generated or not.';
    } else if (AIpercentage < 25) {
        likelyhood = 'There\'s definitly an amount of AI generated code here, but the code was likely reviewed by a human developer.';
    } else if (AIpercentage < 50) {
        likelyhood = 'There\'s a lot of AI generated code here, it\'s getting dangerously close to be sloppy.';
    } else if (AIpercentage < 80) {
        likelyhood = 'There\'s a lot of AI SLOP left in the codebase. It probably was not fully reviewed by a human.';
    } else {
        likelyhood = 'This code was most definitely NOT reviewed by a human, the amount of slop left is alarming.';
    }

    if (commentRatio > 0.2) {
        commentRatioText = 'The ratio of comment to code is over 20%, this automatically pushes the score to 100%';
        aiScore = 100;
    }

    if (emojiRatio > 0.12) {
        emojiRatioText = 'The ratio of emoji to code is over 10%, this automatically pushes the score to 100%';
        aiScore = 100;
    }

    $('.ai-score-value').html(`${likelyhood} ${!commentRatioText && !emojiRatioText ? 'Calculated score: ' + AIpercentage + '%' : commentRatioText || emojiRatioText}`);
    $('.global-scores').removeClass('hidden');
    $('.result-breakdown').removeClass('hidden');

    updateSection('.truncation-artifacts', truncation.count, `Found ${truncation.count} instances of lazy code truncation.`);
    updateSection('.conversational-artifacts', conversation.count, `Found ${conversation.count} conversational phrases.`);
    updateSection('.comment-ratio', comments.count, commentsRatio(value));
    updateSection('.emoji-ratio', emojis.count, emojisRatio(value));
    updateSection('.common-ai-choices', commonLibraries.count, `The inspected code shows ${commonLibraries.count} libraries commonly chosen by AI.`);
    updateSection('.common-ai-patterns', commonPatternsStats.count, `The inspected code shows ${commonPatternsStats.count} known AI patterns.`);

    updateList('.common-ai-patterns', commonPatternsStats?.results, 'highlight warning');
    updateList('.truncation-artifacts', truncation?.results);
    updateList('.conversational-artifacts', conversation?.results);
    updateList('.common-ai-choices', commonLibraries?.results, 'highlight info');
}

function updateSectionReadme() {
    const value = $('textarea#code').val();
    let html = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const commonPatternsStats = commonReadmePatterns(value, html);
    html = commonPatternsStats.html;

    const threeWords = commonThreeWordsPattern(value, html);
    html = threeWords.html;

    const emojis = emojiCounter(value, html);
    html = emojis.html;

    $('#highlighted-result').html(html);
    $('#code').addClass('hidden');
    $('#highlighting-content').parent().addClass('hidden');
    $('#highlighted-result').removeClass('hidden');
    $('#detect').addClass('hidden');
    $('#edit').removeClass('hidden');

    const lines = lineCounter(value) || 1;
    const emojiRatio = emojis.count / lines;

    let aiScore = 0;
    aiScore += (emojiRatio * 50);
    aiScore += (commonPatternsStats.weight);
    aiScore += (threeWords.count * 10);



    const AIpercentage = parseInt(Math.min(aiScore, 100));

    let likelyhood;
    if (AIpercentage < 15) {
        likelyhood = 'This markdown file was likely reviewed by a human, can\'t tell if it\'s AI generated or not.';
    } else if (AIpercentage < 25) {
        likelyhood = 'There\'s definitly an amount of AI generated text here, but the markdown file was likely reviewed by a human.';
    } else if (AIpercentage < 50) {
        likelyhood = 'There\'s a lot of AI generated text here, it\'s getting dangerously close to be sloppy.';
    } else if (AIpercentage < 80) {
        likelyhood = 'There\'s a lot of AI SLOP left in the markdown file. It probably was not fully reviewed by a human.';
    } else {
        likelyhood = 'This markdown file was most definitely NOT reviewed by a human, the amount of slop left is alarming.';
    }

    if (emojiRatio > 0.1) {
        likelyhood = 'The ratio of emoji to markdown is over 10%, this automatically pushes the score to 100%';
        aiScore = 100;
    }

    $('.ai-score-value').html(`${likelyhood} ${emojiRatio < 0.1 ? 'Calculated score: ' + AIpercentage + '%' : ''}`);
    $('.global-scores').removeClass('hidden');
    $('.result-breakdown').removeClass('hidden');

    updateSection('.emoji-ratio', emojis.count, emojisRatio(value));
    updateSection('.common-ai-patterns', commonPatternsStats.count, `The inspected code shows ${commonPatternsStats.count} known AI patterns.`);
    updateSection('.triple-word-patterns', threeWords.count, `Found ${threeWords.count} triple word patterns.`);

    updateList('.common-ai-patterns', commonPatternsStats?.results, 'highlight warning');
    const threeWordsResults = threeWords.matches.map(keyword => ({ desc: 'Triple Word Pattern', keyword }));
    updateList('.triple-word-patterns', threeWordsResults, 'highlight info');
}