<!-- // src/routes/login/+page.svelte -->
<script lang="ts">
    import {enhance} from '$app/forms'

    export let form;
    export let data: any;
</script>

<div class="flex flex-col gap-10">
    <div>
        <form method="post" use:enhance action="/signup">
            <label>Email:</label>
            <input name="email" value={form?.email ?? ''}/>
            <label>Pw:</label>
            <input type="password" name="password"/>
            <button>Sign up</button>
        </form>
    </div>
    <div>
        <form method="post" use:enhance action="/signin">
            <label>Email:</label>
            <input name="email" value={form?.email ?? ''}/>
            <label>Pw:</label>
            <input type="password" name="password"/>
            <button>Login</button>
        </form>
    </div>
    <div>
        <form method="post" use:enhance action="/signout">
            <label>Logout:</label>
            <button>Log Out</button>
        </form>
    </div>

</div>