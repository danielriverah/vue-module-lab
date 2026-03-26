
<script>
    const meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
	const mesesShort=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
	export default {
		shortDate:(fecha,year=false) => {
			if (!fecha) return '';
			const d = new Date(fecha);
			const sp=fecha.split('-');
			if(d)
			// return `${mesesShort[d.getMonth()]} ${d.getDate()+1}${year? ` de ${d.getFullYear}`:``}`;
			return `${mesesShort[Number(sp[1]-1)]} ${sp[2]}${year? ` de ${sp[0]}`:``}`;
		}
	}
	
</script>
