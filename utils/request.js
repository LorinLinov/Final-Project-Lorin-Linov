const baseUrl = 'https://tilvltlxdssiogxugkud.supabase.co/rest/v1/';
const apiKey = 'sb_publishable_z3ijVbWjOnE23830OVdfFw_bLLwnn_T';

export default async function request(path = '/', method = 'GET', data = null) {

    const options = {
        headers: {
            'apiKey': apiKey,
        },
    };

    if (method !== 'GET') {
        options.method = method;
    }

    if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${baseUrl}${path}`, options)

    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}