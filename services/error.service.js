import axios from "./axiosInstance";

const errorService = {
    create: async (data) => {
        const res = await axios.post(`/error-log`, data);
        return res.data;
    },
}

export default errorService;
