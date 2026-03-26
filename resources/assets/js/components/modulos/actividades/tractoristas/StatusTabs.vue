<template>
	<div class="status-tabs">
		<a
			v-for="tab in tabs"
			:key="tab"
			:class="{ active: value === tab }"
			@click.prevent="$emit('input', tab)"
		>
			{{ tab }}
		</a>
	</div>
</template>

<script>
	export default {
		name: 'StatusTabs',
		props: {
			tabs: {
				type: Array,
				required: true
			},
			value: {
				type: String,
				required: true
			}
		}
	}
</script>

<style >
.status-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.status-tabs a {
  color: #9e9e9e;
  font-weight: 600;
  font-size: 12px;
  padding-bottom: 6px;
  border-bottom: 2px solid transparent;
}

.status-tabs a.active {
  color: #2e7d32;
  border-bottom-color: #2e7d32;
}
</style>
