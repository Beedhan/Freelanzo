import { TRPCError } from "@trpc/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import { prisma } from "~/server/db";
import { getCurrentUser } from "~/utils/session";

const f = createUploadthing();

const auth = async () => {
  const session = await getCurrentUser();
  return session?.id;
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: { maxFileSize: "4MB" },
    video: { maxFileSize: "16MB" },
    blob: { maxFileSize: "16MB" },
  })
    .input(z.object({ projectId: z.string(), name: z.string() }))
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, input }) => {
      // This code runs on your server before upload
      const user = await auth();
      console.log(user, "user");
      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user, projectId: input.projectId, name: input.name };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log(
        "Upload complete for userId:",
        metadata.userId,
        metadata.projectId,
        metadata.name
      );
      const project = await prisma.project.findUnique({
        where: {
          id: metadata.projectId,
        },
      });
      if(!project){
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      await prisma.notification.create({
        data: {
          projectId: metadata.projectId,
          text: `New file has been uploaded to ${project?.name} project`,
          type: "DEFAULT",
          workspaceId: project.workspaceId,
        },
      });
      await prisma.project.update({
        where: {
          id: metadata.projectId,
        },
        data: {
          Files: {
            create: {
              url: file.url,
              name: metadata.name,
            },
          },
        }
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
