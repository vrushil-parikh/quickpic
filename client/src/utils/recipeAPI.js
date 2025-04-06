import Axios from "./Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "./AxiosToastError";

export const getAllRecipes = async () => {
  try {
    const response = await Axios(SummaryApi.getAllRecipes);
    const { data: responseData } = response;

    if (responseData.success === false) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (error) {
    AxiosToastError(error);
    return [];
  }
};
