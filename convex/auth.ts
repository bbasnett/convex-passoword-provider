import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { z } from "zod";

const ParamsSchema = z.object({
    email: z.email(),
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [
        Password({
            profile(params) {
                const { error, data } = ParamsSchema.safeParse(params);
                if (error) {
                    // throw new ConvexError(error.message);
                    throw new ConvexError("Invalid Email Address");
                }
                return { email: data.email };
            },
            validatePasswordRequirements: (password: string) => {
                if (password.length < 4) {
                    throw new ConvexError(
                        "Password must be at least 4 characters long."
                    );
                }
            },
        }),
    ],
});