import api from "../../../lib/axios";

export const analyzeResume = async ({ resume, jobDescription }) => {
  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("jobDescription", jobDescription);

  const response = await api.post("/resume/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 120_000,
  });

  return response.data.data;
};
