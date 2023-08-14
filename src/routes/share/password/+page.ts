export const load = async ({url, parent}: any) => {
    const id = url.searchParams.get('id');
    const key = url.searchParams.get('key');
    const pwLocation = url.searchParams.get('location');
    const pwUser = url.searchParams.get('user');

    return {
        id: id,
        key: key,
        pwLocation: pwLocation,
        pwUser: pwUser
    }
}