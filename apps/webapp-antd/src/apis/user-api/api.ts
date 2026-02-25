const API_V1_0_0_PREFIX = '/user/v1.0.0';

export const Api_v1_0_0 = {
  create: `${API_V1_0_0_PREFIX}/create`,
  update: `${API_V1_0_0_PREFIX}/update`,
  queryId: (id: string) => `${API_V1_0_0_PREFIX}/query/${id}`,
  queryFilter: `${API_V1_0_0_PREFIX}/query/filter`,
  deleteId: (id: string) => `${API_V1_0_0_PREFIX}/delete/${id}`,
  deleteFilter: `${API_V1_0_0_PREFIX}/delete/filter`,
};

export default Api_v1_0_0;
