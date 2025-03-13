import { assert } from "./assert";
import fetch from "node-fetch";
import { handleError } from "./errorHandler";

export const searchPhoto = async (query: string): Promise<string> => {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    assert(accessKey, 'UNSPLASH_ACCESS_KEY не найден в .env файле');
    const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}&per_page=40`
    );
    const data = await response.json() as { results: { urls: { regular: string } }[] };
    if (!data.results.length) {
        handleError('Фотографии не найдены');
    }

    const randomIndex = Math.floor(Math.random() * data.results.length);

    return data.results[randomIndex].urls.regular;
};
