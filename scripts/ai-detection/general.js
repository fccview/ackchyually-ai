const organizePatterns = (patterns, value, html, highlight) => {
    const results = patterns.filter(pattern =>
        value?.toLowerCase().includes(pattern?.keyword?.toLowerCase())
    );

    const descriptions = results.map(result => result.desc);
    const keywords = results.map(result => result.keyword);

    keywords.forEach(keyword => {
        const escapedKeyword = escapeHtml(keyword);
        const regex = new RegExp(escapedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        html = html.replace(regex, `<span class="highlight ${highlight}">$&</span>`);
    });

    const weight = results.reduce((acc, item) => acc + (item?.weight || 0), 0);

    return { count: keywords.length, keywords, descriptions, results, html, weight };
}

const lineCounter = (value) => {
    const lines = value.split('\n').length;

    return lines;
}

const escapeHtml = (text) => {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const emojiCounter = (value, html) => {
    html = html || value;
    const regex = /(\u00a9|\u00ae|[\u203c\u2049\u2122\u2139]|[\u2300-\u23ff]|[\u2600-\u27bf]|[\u2934-\u2935]|[\u2b00-\u2bff]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g; const matches = value.match(regex);
    const count = matches ? matches.length : 0;

    html = html.replace(regex, '<span class="highlight warning">$&</span>');

    return { count, matches, html };
}

const emojisRatio = (value) => {
    const emojiCount = emojiCounter(value)?.count || 0;
    const linesCount = lineCounter(value);
    const ratio = emojiCount / linesCount;

    return `${emojiCount} emojis for ${linesCount} lines of code. That's a ratio of ${(ratio * 100).toFixed(2) > 0 ? (ratio * 100).toFixed(0) : `nearly 0`}%. The site assumes something is 100% AI generated if the ratio goes above 12%.`;
}

const commonThreeWordsPattern = (value, html) => {
    html = html || value;
    const regex = /\b[a-zA-Z]+,\s+[a-zA-Z]+,\s+[a-zA-Z]+\b/g;

    const matches = value.match(regex) || [];

    matches.forEach(match => {
        const escapedMatch = escapeHtml(match);
        const replaceRegex = new RegExp(escapedMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

        html = html.replace(replaceRegex, '<span class="highlight info">$&</span>');
    });

    return { count: matches.length, matches, html };
}