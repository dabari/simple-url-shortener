interface ILinkMapping<T> {
  [id: string]: T;
}

interface IUser {
	username?: string;
  password?: string;
}

interface ICredentials {
	username: string;
	password: string;
	rememberMe: boolean;
}
