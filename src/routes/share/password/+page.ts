export const load = async ({url, parent}: any) => {
    const id = url.searchParams.get('id');
    const key = url.searchParams.get('key');

    return {
        id: id,
        key: key
    }
}