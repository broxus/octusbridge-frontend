export async function handleApi<R>(params: {
    url: string;
    data?: object;
    method?: 'POST' | 'GET';
}): Promise<R> {
    const response = await fetch(params.url, {
        method: params.method || 'POST',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: params.data ? JSON.stringify(params.data) : undefined,
    })

    if (!response.ok) {
        throw response
    }

    const result: R = await response.json()

    return result
}
