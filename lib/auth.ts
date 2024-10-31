import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import  prisma  from "./prisma";
import { cookies } from "next/headers";
import { cache } from "react";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
      name: attributes.name,
      role: attributes.role,
      schoolId: attributes.schoolId
    };
  }
});

export const getUser = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value;
  if (!sessionId) return null;
  const { user } = await lucia.validateSession(sessionId);
  return user;
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: string;
      email: string;
      name: string;
      role: "USER" | "ADMIN" | "SUPERADMIN";
      schoolId: string | null;
    };
  }
}