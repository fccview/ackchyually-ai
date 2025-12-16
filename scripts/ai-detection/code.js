const commonCodePatterns = (value, html) => {
    return organizePatterns(dataCodePatterns, value, html || value, 'warning');
}

const truncationPatterns = (value, html) => {
    return organizePatterns(dataTruncations, value, html || value, 'danger');
}

const conversations = (value, html) => {
    return organizePatterns(dataConversations, value, html || value, 'danger');
}

const commonAIChoices = (value, html) => {
    return organizePatterns(dataLibraries, value, html || value, 'info');
}

const commentsCounter = (value, html) => {
    html = html || value;
    const slashInlineComments = /\/\/ .*$/gm;
    const slashBlockComments = /\/\*[\s\S]*?\*\//g;
    const htmlCommentsRaw = /<!--[\s\S]*?-->/g;
    const phpCommentsRaw = /<\?[\s\S]*?\?>|\/\*[\s\S]*?\*\//g;
    const htmlCommentsEscaped = /&lt;!--[\s\S]*?--&gt;/g;
    const phpCommentsEscaped = /&lt;\?[\s\S]*?(\?&gt;|--&gt;)/g;

    const textType = $('#text-type').val();

    let hashComments;

    if (textType !== README) {
        hashComments = /(?<![:'"]|:\s)#(?!([a-fA-F0-9]{3}|[a-fA-F0-9]{6})\b).*|\/\*[\s\S]*?\*\//g;
    }

    const slashInlineMatches = value.match(slashInlineComments) || [];
    const slashBlockMatches = value.match(slashBlockComments) || [];
    const htmlMatches = value.match(htmlCommentsRaw) || [];
    const phpMatches = value.match(phpCommentsRaw) || [];
    const hashMatches = hashComments ? (value.match(hashComments) || []) : [];

    const count = slashInlineMatches.length + slashBlockMatches.length + htmlMatches.length + phpMatches.length + hashMatches.length;

    html = html.replace(slashInlineComments, '<span class="highlight secondary">$&</span>');
    html = html.replace(slashBlockComments, '<span class="highlight secondary">$&</span>');
    html = html.replace(htmlCommentsEscaped, '<span class="highlight secondary">$&</span>');
    html = html.replace(phpCommentsEscaped, '<span class="highlight secondary">$&</span>');

    if (hashComments) {
        html = html.replace(hashComments, '<span class="highlight secondary">$&</span>');
    }

    return { count, matches: slashInlineMatches.concat(slashBlockMatches, htmlMatches, phpMatches, hashMatches), html };
}

const commentsRatio = (value) => {
    const commentsCount = commentsCounter(value)?.count || 0;
    const linesCount = lineCounter(value);
    const ratio = commentsCount / linesCount;

    return `${commentsCount} comments for ${linesCount} lines of code. That's a ratio of ${(ratio * 100).toFixed(2) > 0 ? (ratio * 100).toFixed(0) : `nearly 0`}%. The site assumes something is 100% AI generated if the ratio goes above 20%.`;
}