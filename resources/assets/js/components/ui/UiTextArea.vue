<template>
    <div>
		<label>{{ label }}</label>
		<textarea
			:type="type"
			:value="value"
			@input="$emit('input', $event.target.value)"
			class="materialize-textarea"
			:class="{ invalid: error }"
		></textarea>
		<small v-if="error && typeof(error)=='object'" class="error">{{ error }}</small>
		<small v-else-if="error" class="error">{{ error }}</small>
    </div>
</template>
  
<script>
	export default {
		props: {
		value: null,
		label: String,
		type: { default: 'text' },
		error: String,
		
		}
	}
</script>