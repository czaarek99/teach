import Axios, { AxiosInstance, AxiosError } from "axios";
import { IHttpError, HttpError, ErrorMessage } from "common-library";

export class BaseService {

	protected readonly axios: AxiosInstance;

	constructor() {
		const location = window.location;

		this.axios = Axios.create({
			baseURL: `${location.protocol}//api.${location.hostname}:5000`
		});

		this.axios.interceptors.response.use((response) => {
			return response;
		}, (error: AxiosError) => {
			if(error.response && error.response.data) {

				if(typeof error.response.data === "object" &&
					"statusCode" in error.response.data) {

					const data = error.response.data as IHttpError;

					const httpError =  new HttpError()
					httpError.fromJSON(data);

					return Promise.reject(httpError);
				} else {
					console.error("Unknown axios error below: ")
					console.dir(error);
					console.error("---------------------------");

					const httpError = new HttpError(
						error.response.status,
						ErrorMessage.UNKNOWN,
						"",
						true
					);

					return Promise.reject(httpError);
				}

			}

			//Not an axios error
			return Promise.reject(error);
		})
	}

}