import {assert} from "./assert";
import fetch from "node-fetch";
import {handleError} from "./errorHandler";

export const searchPhoto = async (query: string): Promise<string> => {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    assert(accessKey, 'UNSPLASH_ACCESS_KEY не найден в .env файле');

    const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}&per_page=1`
    );
    const data = await response.json() as { results: { urls: { regular: string } }[] };

    if (!data.results.length) {
        handleError('Фотографии не найдены');
    }

    return data.results[0].urls.regular;
};