
const commonReadmePatterns = (value, html) => {
    html = html || value;
    const patterns = dataReadmePatterns;

    return organizePatterns(patterns, value, html, 'warning');
}