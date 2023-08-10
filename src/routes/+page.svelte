<script>
	export let data;
</script>

<ul class="text-5xl">
	{#each data.countries as country}
		<li>{country.name}</li>
	{/each}
</ul>