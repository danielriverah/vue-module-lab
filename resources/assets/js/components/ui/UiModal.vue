<template>
    <div v-if="value" class="overlay" @click.self="$emit('input', false)">
		<div class="modal-box">
			<slot name="head" />
			<slot name="body" />
			<slot />
			<slot name="foot" />
		</div>
    </div>
</template>
  
<script>
	export default {
		props: { value: Boolean }
	}
</script>