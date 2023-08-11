<script>
    import Hero from "$lib/components/Hero.svelte";
    import Stats from "$lib/components/Stats.svelte";

    export let data

    const handleSignOut = async () => {
        await data.supabase.auth.signOut()
    }

    // import kyber from 'crystals-kyber';

    // // To generate a public and private key pair (pk, sk)
    // let pk_sk = kyber.KeyGen768();
    // let pk = pk_sk[0];
    // let sk = pk_sk[1];
    //
    // // To generate a random 256-bit symmetric key (ss) and its encapsulation (c)
    // let c_ss = kyber.Encrypt768(pk);
    // let c = c_ss[0];
    // let ss1 = c_ss[1];
    //
    // // To decapsulate and obtain the same symmetric key
    // let ss2 = kyber.Decrypt768(c, sk);

</script>

<Hero/>

<Stats/>