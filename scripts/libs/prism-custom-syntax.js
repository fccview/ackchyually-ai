Prism.languages.generic = {
    'comment': [
        { pattern: /\/\*[\s\S]*?(?:\*\/|$)/, greedy: true },
        { pattern: /\/\/.*/, greedy: true },
        { pattern: /#.*/, greedy: true },
        { pattern: /<!--[\s\S]*?-->/, greedy: true }
    ],
    'tag': {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
        greedy: true,
        inside: {
            'tag': {
                pattern: /^<\/?|[^\s>\/]+/,
                inside: {
                    'punctuation': /^<\/?/,
                    'namespace': /^[^\s>\/:]+:/
                }
            },
            'attr-value': {
                pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                inside: {
                    'punctuation': [
                        /^=/,
                        {
                            pattern: /^(\s*)["']|["']$/,
                            lookbehind: true
                        }
                    ]
                }
            },
            'punctuation': /\/?>/,
            'attr-name': /[^\s>\/]+/
        }
    },
    'string': {
        pattern: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
        greedy: true
    },
    'class-name': {
        pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
        lookbehind: true,
        inside: {
            'punctuation': /[.\\]/
        }
    },
    'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue|var|let|const|class|import|from|export|async|await|def|end|lambda|public|private|protected|static|void|int|char|float|double|boolean|bool|string)\b/,
    'boolean': /\b(?:true|false)\b/,
    'function': /\b\w+(?=\()/,
    'number': /\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee][+-]?\d+)?)\b/,
    'operator': /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|~|\^|%/,
    'punctuation': /[{}[\];(),.:]/,
    'variable': [
        {
            pattern: /\b[a-zA-Z_]\w*(?=\s*=)/
        },
        {
            pattern: /(\b(?:var|let|const|int|float|string|bool|boolean)\s+)[a-zA-Z_]\w*/,
            lookbehind: true
        },
        {
            pattern: /\$[a-zA-Z_]\w*/
        }
    ]
};