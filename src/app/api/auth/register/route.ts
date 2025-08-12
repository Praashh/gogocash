import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "../../../../../db/prisma";
import bcrypt from "bcryptjs";

const signUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log(body)
        const { name, email, password } = signUpSchema.parse(body);

        const isUserExists = await prisma.user.findUnique({
            where: { email },
        });

        if (isUserExists) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        return NextResponse.json(
            { 
                message: "User created successfully",
                user 
            },
            { status: 201 }
        );
        
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error.issues },
                { status: 400 }
            );
        }

        console.error('Registration error:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}