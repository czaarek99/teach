import Axios, { AxiosInstance, AxiosError } from "axios";

import {
	IHttpError,
	HttpError,
	ErrorMessage,
	SESSION_HEADER_NAME,
	SESSION_KEY_NAME
} from "common-library";

export class BaseService {

	protected readonly axios: AxiosInstance;

	constructor(prefix: string) {
		const location = window.location;

		this.axios = Axios.create({
			baseURL: `${location.protocol}//api.${location.hostname}:5000${prefix}`,
			withCredentials: true
		});

		this.axios.interceptors.request.use((config) => {
			config.headers[SESSION_HEADER_NAME] = localStorage.getItem(SESSION_KEY_NAME);

			return config;
		}, (error) => {
			return Promise.reject(error);
		})

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