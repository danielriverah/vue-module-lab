export function applyFilters(data, filters){

    if(!Array.isArray(data)) return []

    return data.filter(item => {

        return Object.keys(filters).every(key => {

            const filter = filters[key]

            if(filter === null || filter === undefined) return true

            const field = item[key]

            switch(filter.type){

                case 'text':
                    if(!filter.value) return true
                    return String(field)
                        .toLowerCase()
                        .includes(String(filter.value).toLowerCase())

                case 'exact':
                    if(filter.value === '' || filter.value === null) return true
                    return field == filter.value

                case 'in':
                    if(!Array.isArray(filter.value) || !filter.value.length) return true
                    return filter.value.includes(field)

                case 'range':
                    const min = filter.min
                    const max = filter.max

                    if(min != null && field < min) return false
                    if(max != null && field > max) return false

                    return true

                case 'date-range':
                    const start = filter.start ? new Date(filter.start) : null
                    const end = filter.end ? new Date(filter.end) : null
                    const value = new Date(field)

                    if(start && value < start) return false
                    if(end && value > end) return false

                    return true

                case 'boolean':
                    if(filter.value === null) return true
                    return field === filter.value

                default:
                    return true
            }

        })

    })

}