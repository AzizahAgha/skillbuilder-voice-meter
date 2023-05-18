import axios from "./axiosInstance";

const uploadCsvService = {
  uploadCsv: async ({ data, onUploadProgress, params }) => {
    if (params.fileType === "UPLOAD") {
      var formdata = new FormData();
      formdata.append("csv", data);
      const res = await axios.post(`/csv-json`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
        params: params,
      });
      return res.data;
    } else {
      const res = await axios.post(`/csv-json`, data, {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
        onUploadProgress,
        params: params,
      });
      return res.data;
    }
  },
};

export default uploadCsvService;
