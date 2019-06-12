import * as Redis from "ioredis";

declare module "ioredis" {
	interface Redis {
		call: (func: string, ...arguments: any) => Promise<null | string>
	}
}

export class RedisClient {

	private readonly redis: Redis.Redis;

	constructor(options: Redis.RedisOptions) {
		this.redis = new Redis(options);
	}


	public async setJSONObject<T>(key: string, object: T) : Promise<void> {
		await this.redis.call("JSON.SET", key, ".", JSON.stringify(object));
	}

	public async deleteJSONObject(key: string) : Promise<void> {
		this.redis.call("JSON.DEL", key);
	}

	public async setJSONValue<T>(key: string, jsonKey: keyof T, jsonValue: any) : Promise<void> {
		await this.redis.call("JSON.SET", key, jsonKey, jsonValue);
	}

	public async getJSON<T>(key: string) : Promise<T> {
		const value = await this.redis.call("JSON.GET", key);

		if(value === null) {
			return null;
		} 

		return JSON.parse(value);
	}


}