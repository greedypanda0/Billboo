"use server";
import { prisma } from "@/lib/prisma";
import { ClientSchemaType } from "@/schemas";
import { getSession } from "./getSession";

export async function getClients() {
  try {
    const user = await getSession();
    if (!user) throw new TypeError("no useer");
    return await prisma.client.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

export async function getClientWithInvoices() {
  try {
    const user = await getSession()
    if (!user) throw new TypeError("no useer");
    return await prisma.client.findMany({
      where: {
        userId: user.id,
      },
      include: {
        invoices: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching clients with invoices:", error);
    return [];
  }
}

export async function createClient(values: ClientSchemaType): Promise<{
  success?: boolean;
  error?: string;
}> {
  try {
    const user = await getSession();
    if (!user) return { error: "Invalid request" };

    const existing = await prisma.client.findFirst({
      where: { name: values.name },
    });

    if (existing) return { success: true };

    await prisma.client.create({
      data: {
        name: values.name,
        email: values.email,
        userId: user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating client:", error);
    return { error: "Something went wrong" };
  }
}
