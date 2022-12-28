import { ApiMethods, ApiRoutes } from "../defineApi";
import Repository from "../RepositoryApi";
const route: ApiRoutes = {
  url: "/orders/paging",
  method: ApiMethods.GET,
};

export const getALllOrderPaging = async (size: number, page: number) => {
  const payload = {
    page: page,
    size: size,
    column: "id",
    sort: "asc",
  };
  return Repository(route, payload);
};
