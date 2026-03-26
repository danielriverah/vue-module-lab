<!-- <template>
    <table>
      <thead>
        <slot name="header" />
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </template> -->
  <!-- slots head, body, foot -->
<template>
	<UiTableBase ref="tablaRef">
		<template slot="head" >
			<tr>
				<th v-for="(h, index) in getHeaders" :key="index">{{ h }}</th>
			</tr>
		</template>
		<template slot="body">
			<UiTableRow v-for="(row,index) in rows" :key="index" :row="row">
				<td v-for="(h,indx) in row" :key="`${index}-${indx}`">
					{{ h }}
				</td>
				<template #action>
					<slot name="action" />
				</template>
			</UiTableRow>
		</template>
	</UiTableBase>
</template>
<script>
	import UiTableBase from './UiTableBase.vue';
	import UiTableRow from './UiTableRow.vue';
	export default {
		name:'UiTable',
		mounted(){
			console.log(this.value)
			//this.$refs.tablaRef.tablaRef();
		},
		components:{
			UiTableBase,UiTableRow
		},
		props:['value','headers'],
		data() {
			return {
				rows: this.value || [],
				heads: this.headers || []
			}
		},
		computed: {
			getHeaders(){
				if(this.heads.length > 0) return this.heads;
				return Object.keys(this.rows[0]);
			}
		}
	}
</script>