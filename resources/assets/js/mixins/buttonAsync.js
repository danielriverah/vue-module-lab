export const buttonAsync = {
    data() {
        return {
            loading: false
        }
    },

    methods: {
        async run(action) {
            if (this.loading) return

            this.loading = true
            try {
                await action()
            } finally {
                this.loading = false
            }
        }
    }
}