import axios from "./axiosInstance";

const questionBankService = {
  get: async ({size,search,qfilters}) => {
    const res = await axios.post(`/questions-list?size=${size}&searchString=${search}`,qfilters);
    return res.data;
  },
  getFilters: async () => {
    const res = await axios.get(`/questions-list-filters`);
    return res.data;
  },
};

export default questionBankService;
