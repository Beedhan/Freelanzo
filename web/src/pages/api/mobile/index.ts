import cookie from 'cookie'
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { NextApiResponse, NextApiRequest } from "next";
import { HOST_URL } from '~/utils/lib';

export default async function handler(
  req: NextApiRequest,
  nextRes: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      // getURL() returns http://localhost:3000 locally
      console.log(req)
      let Cookie
        const response = await fetch(`${HOST_URL}/api/auth/csrf`).then(
        (res) => {
          const parsedCookie = cookie.parse(res.headers.get('set-cookie'))
          delete parsedCookie.Path
          delete parsedCookie.SameSite
          Cookie = Object.entries(parsedCookie)
            .map(([key, val]) => cookie.serialize(key, val))
            .join('; ')
          return res.json()
        }
      )
      const csrfToken = response.csrfToken
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie,
        },
        body: new URLSearchParams({
          email: req.body.email,
          password: req.body.password,
          redirect: 'false',
          csrfToken,
          json: 'true',
        }),
      }
      
      const res = await fetch(`${HOST_URL}/api/auth/callback/credentials`, fetchOptions)
      const parsedCookie = (res.headers.get('set-cookie'))
      console.log(parsedCookie)
      const regex = /next-auth.session-token=([^;]+)/;
      const matches = parsedCookie?.match(regex);
      const sessionToken = matches[1];

      return nextRes.setHeader('set-cookie', `next-auth.session-token=${sessionToken}; Path=/; Expires=Fri, 28 Jul 2023 19:07:12 GMT; HttpOnly; SameSite=Lax`).json({ sessionToken })
    } else {
      return "aru aayo yrr";
      // Handle any other HTTP method
    }
  } catch (error) {
    console.log(error);
    return nextRes.json({ error: error?.message });
  }
}
