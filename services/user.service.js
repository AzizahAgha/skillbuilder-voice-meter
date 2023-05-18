import axios from "./axiosInstance";

const userService = {
  get: async (id) => {
    // to get current auth user's profile pass id as 'profile'
    const res = await axios.get(`/user/${id}`);
    return res.data;
  },
  update: async ({ id, data }) => {
    var formdata = new FormData();
    formdata.append("userImage", data.userImage);
    formdata.append("personalDetails", JSON.stringify(data.personalDetails));
    const response = await axios.patch(`/user/${id}`, formdata);
    return response.data;
  },
  update_contact: async ({ id, data }) => {
    var formdata1 = new FormData();
    formdata1.append("contactDetails", JSON.stringify(data.contactDetails));
    const response = await axios.patch(`/user/${id}`, formdata1);
    return response.data;
  },
  update_privacy: async ({ id, data }) => {
    var formdata2 = new FormData();
    formdata2.append("privacyDetails", JSON.stringify(data.privacyDetails));
    const response = await axios.patch(`/user/${id}`, formdata2);
    return response.data;
  },
  getdepartment: async () => {
    const res = await axios.get(`/departments`);
    return res.data;
  },
};

export default userService;
