import {
    createErrorResponse,
    createSuccessResponse,
    DiaryErrors,
} from "@/lib/error";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { z } from "zod";

// Validation schema for diary entries
const diaryEntrySchema = z.object({
    content: z
        .string()
        .min(10, "Diary entry must be at least 10 characters long")
        .max(5000, "Diary entry must be less than 5000 characters"),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
        .optional()
        .default(() => new Date().toISOString().split("T")[0]),
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

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user?.id) {
            return createErrorResponse(DiaryErrors.unauthorized());
        }

        const body = await req.json();
        const validation = diaryEntrySchema.safeParse(body);

        if (!validation.success) {
            return createErrorResponse(validation.error);
        }

        const { content, date, mood } = validation.data;

        // Check if entry already exists for this date
        const existingEntry = await prisma.diaryEntry?.findFirst({
            where: {
                userId: session.user.id,
                date: new Date(date),
            },
        });

        if (existingEntry) {
            return createErrorResponse(DiaryErrors.entryAlreadyExists());
        }

        // Create diary entry (assuming you'll add this to your schema)
        const entry = await prisma.diaryEntry?.create({
            data: {
                content,
                date: new Date(date),
                mood,
                userId: session.user.id,
            },
        });

        return createSuccessResponse(
            { entry },
            "📝 Diary entry saved successfully!",
            201
        );
    } catch (error) {
        return createErrorResponse(error);
    }
}

export async function GET(req: NextRequest) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user?.id) {
            return createErrorResponse(DiaryErrors.unauthorized());
        }

        const { searchParams } = new URL(req.url);
        const date = searchParams.get("date");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

        // Build where clause
        const where: any = { userId: session.user.id };
        if (date) {
            where.date = new Date(date);
        }

        // Get entries with pagination
        const entries = await prisma.diaryEntry?.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                content: true,
                date: true,
                mood: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        const total = await prisma.diaryEntry?.count({ where });

        return createSuccessResponse(
            {
                entries: entries || [],
                pagination: {
                    page,
                    limit,
                    total: total || 0,
                    pages: Math.ceil((total || 0) / limit),
                },
            },
            "📖 Diary entries retrieved successfully"
        );
    } catch (error) {
        return createErrorResponse(error);
    }
}
