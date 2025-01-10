import { $host, $authHost } from "."

export const create = async ({user_id, driver_id, text, rate}) => {
    const {data} = await $host.post('/review', {user_id, driver_id, text, rate})
    return data
}

export const deleteRewiew = async (id) => {
    const {data} = await $host.delete(`/review/${id}`)
    return data
}

export const getRewiewById = async (id) => {
    const {data} = await $host.get(`/review/${id}`)
    return data
}

export const getRewiews = async () => {
    const {data} = await $authHost.get('/reviews')
    return data
}

export const getRewiewByUserId = async (id) => {
    const {data} = await $authHost.get(`/review/user?user_id=${id}`)
    return data
}

export const getRewiewByDriverId = async (id) => {
    const {data} = await $host.get(`/review/user?driver_id=${id}`)
    return data
}