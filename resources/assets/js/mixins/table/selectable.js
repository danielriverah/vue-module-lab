export const tableSelectable = {
    props: {
        rows: {
            type: Array,
            required: true
        },
    
        selectionMode: {
            type: String,
            default: 'single' // single | multiple
        }
    },
  
    data() {
        return {
            selectedRows: []
        }
    },
  
    computed: {
        isMultiple() {
            return this.selectionMode === 'multiple'
        }
    },
  
    methods: {
        isSelected(row) {
            return this.selectedRows.includes(row)
        },
    
        toggleRow(row) {
            if (this.isMultiple) {
            this.toggleMultiple(row)
            } else {
            this.selectSingle(row)
            }
    
            this.$emit('row-select', this.selectedRows)
        },
    
        selectSingle(row) {
            this.selectedRows = [row]
        },
    
        toggleMultiple(row) {
            const index = this.selectedRows.indexOf(row)
    
            if (index > -1) {
            this.selectedRows.splice(index, 1)
            } else {
            this.selectedRows.push(row)
            }
        },
    
        handleRowClick(row) {
            this.toggleRow(row)
            this.$emit('row-click', row)
        },
    
        handleRowDblClick(row) {
            this.$emit('row-dblclick', row)
        },
    
        clearSelection() {
            this.selectedRows = []
        }
    }
  }