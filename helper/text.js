export const isValidYoutubeLink = (link) => {
    //trim link
    link = link.trim()
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(link);
}

export const parseYoutubeLink = (link) => {
    if (!isValidYoutubeLink(link)) {
        return null;
    }

    const url = new URL(link)
    if (!url.searchParams.has('v')) {
        const pathname = url.pathname
        const videoId = pathname.substring(1)
        return videoId
    }
    const videoId = url.searchParams.get('v')
    return videoId
}

export const removeQuoteWord = (inputString) => {
    if (typeof inputString !== 'string') {
        return inputString
    }
    const resultString = inputString.replaceAll('\'', '');
    return resultString;
}