export function handleLaravelErrors(error) {
    console.log(error)
    const result = {
        _message: null
    }
    
    if (!error || !error.response) {
        result._message = 'Error inesperado. Intente nuevamente.'
        return result
    }
  
    const { status, data } = error.response
    console.log(data)
    if (status === 422 && data?.errors) {
        return {
            ...data.errors,
            _message: data.message || 'Verifique los campos del formulario.'
        }
    }
  
    if (status === 401) {
      console.warn('No autenticado')
    }
  
    if (status === 403) {
      console.warn('No autorizado')
    }
    if (status === 404) {
        result._message = 'Recurso no encontrado. '
      }
    if (status === 500) {
      console.error('Error interno del servidor')
    }
  
    return {}
}

export function buildFormData(data, formData = new FormData(), parentKey = null) {
    if (data === null || data === undefined) return formData
  
    if (data instanceof File) {
      formData.append(parentKey, data)
      return formData
    }
  
    if (typeof data === 'object' && !(data instanceof Date)) {
      Object.keys(data).forEach(key => {
        const value = data[key]
        const fullKey = parentKey ? `${parentKey}[${key}]` : key
        buildFormData(value, formData, fullKey)
      })
    } else {
      formData.append(parentKey, data)
    }
  
    return formData
}
export function resetForm(form) {
    Object.keys(form).forEach(key => {
        if (Array.isArray(form[key])) {
            form[key] = []
        } else if (typeof form[key] === 'object' && form[key] !== null) {
            form[key] = null
        } else {
            form[key] = ''
        }
    })
}

export function firstError(errors, field) {
    if (!errors[field]) return null
    return Array.isArray(errors[field]) ? errors[field][0] : errors[field]
}  
export function clearFieldError(errors, field) {
    if (errors[field]) {
        delete errors[field]
    }
}
export function normalizePayload(data) {
    const payload = { ...data }
  
    Object.keys(payload).forEach(key => {
        if (payload[key] === '') payload[key] = null
    })
  
    return payload
}
export function hasErrors(errors) {
    return Object.keys(errors).some(
        key => key !== '_message'
    )
}