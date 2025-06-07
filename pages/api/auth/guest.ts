import { NextApiRequest, NextApiResponse } from "next";
import { encode } from "next-auth/jwt";
import { setCookie } from "nookies";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const name = req.query.name || "Guest";

  const token = await encode({
    token: { name, id: name },
    secret: process.env.NEXTAUTH_SECRET!,
  });

  setCookie({ res }, "next-auth.session-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 дней
  });

  res.redirect("/");
}
