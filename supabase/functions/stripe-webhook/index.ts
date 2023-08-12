import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = Stripe(Deno.env.get("STRIPE_API_KEY"));

function getSupabaseAdminClient() {
    return createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
        {auth: {persistSession: false}}
    );
}

async function customerExists(client: any, stripeCustomerId: string) {
    const response = await client.from('UserData').select('*', {count: 'exact'}).eq("stripeCustomerId", stripeCustomerId)
    return response.count !== 0
}

async function delay(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}


serve(async (request) => {

    const signature = request.headers.get("Stripe-Signature");

    const body = await request.text();

    let receivedEvent;
    try {
        receivedEvent = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET"),
            undefined
        );
    } catch (err) {
        return new Response(err.message, {status: 400});
    }

    const requestOptions =
        receivedEvent.request && receivedEvent.request.idempotency_key
            ? {
                idempotencyKey: receivedEvent.request.idempotency_key,
            }
            : {};

    let retrievedEvent;
    try {
        retrievedEvent = await stripe.events.retrieve(
            receivedEvent.id,
            requestOptions
        );
    } catch (err) {
        return new Response(err.message, {status: 400});
    }

    if (retrievedEvent.type === "checkout.session.completed") {
        const supabaseClient = getSupabaseAdminClient();
        const sr = await supabaseClient.from("UserData").update(
            {
                stripeCustomerId: retrievedEvent.data.object.customer
            }
        ).eq("userId", retrievedEvent.data.object.client_reference_id);
        console.log(sr);
        console.log(`checkout.session.completed for ${retrievedEvent.data.object.client_reference_id} with stripeID ${retrievedEvent.data.object.customer}`)
    }

    if (retrievedEvent.type === "customer.subscription.updated") {
        const supabaseClient = getSupabaseAdminClient();
        let customerId = retrievedEvent.data.object.customer;
        let canUpdatePremium = await customerExists(supabaseClient, customerId)
        let cnt = 0;
        while (!canUpdatePremium && cnt < 10) {
            await delay(500);
            canUpdatePremium = await customerExists(supabaseClient, customerId)
        }

        if (canUpdatePremium) {
            const sr = await supabaseClient.from("UserData").update({premium: true})
                .eq("stripeCustomerId", retrievedEvent.data.object.customer);
            console.log(sr);
            console.log(`customer.subscription.updated for ${retrievedEvent.data.object.customer}`)
        } else {
            return new Response(`Error while trying to set customer premium for ${retrievedEvent.data.object.customer}`, {status: 400});
        }
    }

    if (retrievedEvent.type === "customer.subscription.deleted") {
        const supabaseClient = getSupabaseAdminClient();
        const sr = await supabaseClient.from("UserData").update({premium: false})
            .eq("stripeCustomerId", retrievedEvent.data.object.customer);
        console.log(sr);
        console.log(`customer.subscription.deleted for ${retrievedEvent.data.object.customer}`)
    }

    return new Response(JSON.stringify({ok: true}), {status: 200})
})
