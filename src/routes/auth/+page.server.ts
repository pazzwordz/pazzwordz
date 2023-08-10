import { fail, redirect } from '@sveltejs/kit'
import { AuthApiError } from '@supabase/supabase-js'

export const actions = {
    signup: async ({ request, url, locals: { supabase } }: any) => {
        const formData = await request.formData()
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${url.origin}/auth/callback`,
            },
        })

        if (error) {
            return fail(500, { message: 'Server error. Try again later.', success: false, email })
        }

        return {
            message: 'Please check your email for a magic link to log into the website.',
            success: true,
        }
    },
    signin: async ({ request, locals: { supabase } }: any) => {
        const formData = await request.formData()

        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            if (error instanceof AuthApiError && error.status === 400) {
                return fail(400, {
                    error: 'Invalid credentials.',
                    values: {
                        email,
                    },
                })
            }
            return fail(500, {
                error: 'Server error. Try again later.',
                values: {
                    email,
                },
            })
        }

        throw redirect(303, '/dashboard')
    },

    signout: async ({ locals: { supabase } }: any) => {
        await supabase.auth.signOut()
        throw redirect(303, '/')
    },
}