interface ILinkMapping {
  id: number|null;
  shortLink: string;
  targetUrl: string;
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
