export const baseUrl = "https://3fhmfg6v-3000.inc1.devtunnels.ms/api/"

export const CSRF =baseUrl+ "auth/csrf"
export const SIGNIN = baseUrl+"mobile" // will need csrf to post to this route and 
export const CREDENTIALS = baseUrl+"auth/callback/credentials?" // will need csrf to post to this route and 
export const TEST = baseUrl+"trpc/example.hello" // will need csrf to post to this route and 
export const SESSION = baseUrl+"auth/session" // will need csrf to post to this route and 