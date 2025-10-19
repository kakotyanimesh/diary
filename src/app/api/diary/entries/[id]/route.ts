import {
    createErrorResponse,
    createSuccessResponse,
    DiaryErrors,
} from "@/lib/error";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { z } from "zod";

const updateEntrySchema = z.object({
    content: z
        .string()
        .min(10, "Diary entry must be at least 10 characters long")
        .max(5000, "Diary entry must be less than 5000 characters")
        .optional(),
    mood: z
        .enum([
            "happy",
            "sad",
            "excited",
            "anxious",
            "grateful",
            "frustrated",
            "peaceful",
            "energetic",
        ])
        .optional(),
});

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user?.id) {
            return createErrorResponse(DiaryErrors.unauthorized());
        }

        const entryId = parseInt(params.id);
        if (isNaN(entryId)) {
            return createErrorResponse(
                DiaryErrors.validationError("Invalid entry ID")
            );
        }

        const entry = await prisma.diaryEntry?.findFirst({
            where: {
                id: entryId,
                userId: session.user.id,
            },
            select: {
                id: true,
                content: true,
                date: true,
                mood: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!entry) {
            return createErrorResponse(DiaryErrors.entryNotFound());
        }

        return createSuccessResponse(
            { entry },
            "📖 Diary entry retrieved successfully"
        );
    } catch (error) {
        return createErrorResponse(error);
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user?.id) {
            return createErrorResponse(DiaryErrors.unauthorized());
        }

        const entryId = parseInt(params.id);
        if (isNaN(entryId)) {
            return createErrorResponse(
                DiaryErrors.validationError("Invalid entry ID")
            );
        }

        const body = await req.json();
        const validation = updateEntrySchema.safeParse(body);

        if (!validation.success) {
            return createErrorResponse(validation.error);
        }

        // Check if entry exists and belongs to user
        const existingEntry = await prisma.diaryEntry?.findFirst({
            where: {
                id: entryId,
                userId: session.user.id,
            },
        });

        if (!existingEntry) {
            return createErrorResponse(DiaryErrors.entryNotFound());
        }

        // Update entry
        const updatedEntry = await prisma.diaryEntry?.update({
            where: { id: entryId },
            data: validation.data,
            select: {
                id: true,
                content: true,
                date: true,
                mood: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return createSuccessResponse(
            { entry: updatedEntry },
            "✏️ Diary entry updated successfully!"
        );
    } catch (error) {
        return createErrorResponse(error);
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user?.id) {
            return createErrorResponse(DiaryErrors.unauthorized());
        }

        const entryId = parseInt(params.id);
        if (isNaN(entryId)) {
            return createErrorResponse(
                DiaryErrors.validationError("Invalid entry ID")
            );
        }

        // Check if entry exists and belongs to user
        const existingEntry = await prisma.diaryEntry?.findFirst({
            where: {
                id: entryId,
                userId: session.user.id,
            },
        });

        if (!existingEntry) {
            return createErrorResponse(DiaryErrors.entryNotFound());
        }

        // Delete entry
        await prisma.diaryEntry?.delete({
            where: { id: entryId },
        });

        return createSuccessResponse(
            null,
            "🗑️ Diary entry deleted successfully"
        );
    } catch (error) {
        return createErrorResponse(error);
    }
}
