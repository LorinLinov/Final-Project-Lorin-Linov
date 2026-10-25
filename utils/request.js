const baseUrl = import.meta.env.VITE_dataAPI;
const authUrl = import.meta.env.VITE_authAPIUrl;

async function baseRequest(url, path = '/', method = 'GET', data = null, opts = {}) {

    const options = {
        headers: {
            ...opts.headers,
            'apiKey': import.meta.env.VITE_apiKey,
        },
        ...opts
    };

    if (method !== 'GET') {
        options.method = method;
    }

    if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${url}${path}`, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

export default async function request(path = '/', method = 'GET', data = null, opts = {}) {
    return await baseRequest(baseUrl, path, method, data, opts);
}

export const authRequest = async (path = '/', method = 'GET', data = null, opts = {}) => {
    return await baseRequest(authUrl, path, method, data, opts);
}