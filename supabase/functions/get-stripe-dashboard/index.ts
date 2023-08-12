import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2'
import {serve} from "https://deno.land/std@0.168.0/http/server.ts"

const stripe = Stripe(Deno.env.get("STRIPE_API_KEY"));

export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {

    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL"),
            Deno.env.get("SUPABASE_ANON_KEY"),
            {global: {headers: {Authorization: req.headers.get('Authorization')!}}, auth: {persistSession: false}}
        );

        let {data: userDataEntries} = await supabaseClient.from("UserData").select("*");

        const session = await stripe.billingPortal.sessions.create({
            customer: userDataEntries![0].stripeCustomerId,
            return_url: 'https://www.pazzwordz.io/cloud',
        });

        return new Response(JSON.stringify({url: session.url}), {
            headers: {...corsHeaders, 'Content-Type': 'application/json', 'Content-SHIT': 'idk'},
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({error: error.message}), {
            headers: {...corsHeaders, 'Content-Type': 'application/json'},
            status: 400,
        })
    }
})
