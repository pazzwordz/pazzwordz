import {serve} from "https://deno.land/std@0.168.0/http/server.ts"
import {create} from "https://deno.land/x/djwt@v2.2/mod.ts"
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2'

async function signJwt(email: string, privateKey: any) {
    const now = Math.floor(Date.now() / 1000);
    const validUntil = now + 3600;
    const claims = {
        "iss": email,
        "scope": "https://www.googleapis.com/auth/analytics.readonly",
        "aud": "https://www.googleapis.com/oauth2/v4/token",
        "exp": validUntil,
        "iat": now
    }
    return create({alg: "RS256", typ: "JWT"}, claims, privateKey)
}

async function exchangeGoogleToken(jwtToken: string) {
    const googleToken = await fetch(`https://www.googleapis.com/oauth2/v4/token?grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwtToken}`, {
        method: "POST"
    })
    const tokenData = await googleToken.json();
    return tokenData["access_token"]
}

async function getAnalData(accessToken: string) {
    const body = {
        "metrics": [
            {
                "name": "activeUsers"
            },
            {
                "name": "screenPageViews"
            }
        ],
        "dateRanges": [
            {
                "startDate": "30daysAgo",
                "endDate": "today"
            }
        ],
        "keepEmptyRows": true,
        "metricAggregations": [
            "TOTAL"
        ]
    }
    const googleAnal = await fetch(`https://content-analyticsdata.googleapis.com/v1beta/properties/402589052:runReport?alt=json`, {
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        body: JSON.stringify(body),
        method: "POST"
    });
    return await googleAnal.json();
}

async function getRepoStars(): Promise<number> {
    const result = await fetch("https://api.github.com/repos/pazzwordz/pazzwordz")
    const data = await result.json()
    return data["stargazers_count"];
}

async function getTotalPasswordsManaged(client: any) {
    const result = await client.from("PasswordEntry").select("id", {count: "exact"})
    return result.count;
}

serve(async (req) => {

    const adminClient = createClient(
        Deno.env.get("SUPABASE_URL"),
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
        {auth: {persistSession: false}}
    );

    const jwtToken = await signJwt(Deno.env.get("GOOGLE_SERVICE_EMAIL")!, Deno.env.get("GOOGLE_SERVICE_PRIVATE_KEY")!);
    const accessToken = await exchangeGoogleToken(jwtToken);
    const analData = await getAnalData(accessToken);
    const gitStars = await getRepoStars();
    const pwCount = await getTotalPasswordsManaged(adminClient);
    const activeUsers = analData.rows[0].metricValues[0].value
    const pageViews = analData.rows[0].metricValues[1].value

    const response = await adminClient.from("ProjectStats").insert({
        gitStars: gitStars,
        pageViews: pageViews,
        totalUsers: activeUsers,
        managedPasswords: pwCount
    })

    console.log(response);

    return new Response(
        JSON.stringify({}),
        {headers: {"Content-Type": "application/json"}},
    )
})
