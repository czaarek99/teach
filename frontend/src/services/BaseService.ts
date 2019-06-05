import Axios, { AxiosInstance, AxiosError } from "axios";
import { IHttpError, HttpError } from "common-library";

export class BaseService {

	protected readonly axios: AxiosInstance;

	constructor() {
		this.axios = Axios.create();
		this.axios.interceptors.response.use((response) => {
			return response;
		}, (error: AxiosError) => {
			if(error.response &&
					error.response.data &&
					typeof error.response.data === "object" &&
					"requestId" in error.response.data
				) {

				const data = error.response.data as IHttpError;

				const httpError =  new HttpError()
				httpError.fromJSON(data);

				return Promise.reject(httpError);
			} else {
				console.error("Unknown axios error below: ")
				console.dir(error);
				console.error("---------------------------");

				return Promise.reject(error);
			}
		})
	}

}