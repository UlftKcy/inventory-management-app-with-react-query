import axios from "axios";

const stocksApi = axios.create({
    baseURL: 'https://63b519689f50390584c0823d.mockapi.io'
});

export const getStocks = async () => {
    try {
        const response = await stocksApi.get('/inventory');
        return response.data
    } catch (error) {
        throw new Error("Something is wrong", { cause: error })
    }
}

export const addStock = async (stock) => {
    try {
        const response = await stocksApi.post('/inventory',stock);
        return response.data
    } catch (error) {
        throw new Error("Something is wrong!", { cause: error })
    }
}