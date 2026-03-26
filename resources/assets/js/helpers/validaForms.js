/**
 * Reglas de validación reutilizables
 * 
 * Cada regla devuelve una función con firma:
 * 
 * (value, form) => true | string
 * 
 * true  = válido
 * string = mensaje de error
 */

export const rules = {

    /**
     * Campo obligatorio
     */
    required:(msg="Campo requerido") =>
        (value) => (value !== null && value !== undefined && value !== '')
            ? true
            : msg,

    /**
     * Longitud mínima de string
     */
    minLength:(n,msg=`Mínimo ${n} caracteres`) =>
        (value) =>
            !value || value.length >= n
                ? true
                : msg,

    /**
     * Longitud máxima
     */
    maxLength:(n,msg=`Máximo ${n} caracteres`) =>
        (value) =>
            !value || value.length <= n
                ? true
                : msg,

    /**
     * Longitud exacta
     */
    length:(n,msg=`Debe tener ${n} caracteres`) =>
        (value) =>
            !value || value.length === n
                ? true
                : msg,

    /**
     * Valor mínimo numérico
     */
    min:(n,msg=`Debe ser mayor o igual a ${n}`) =>
        (value) =>
            value === '' || value === null || Number(value) >= n
                ? true
                : msg,

    /**
     * Valor máximo numérico
     */
    max:(n,msg=`Debe ser menor o igual a ${n}`) =>
        (value) =>
            value === '' || value === null || Number(value) <= n
                ? true
                : msg,

    /**
     * Rango numérico
     */
    between:(min,max,msg=`Debe estar entre ${min} y ${max}`) =>
        (value) =>
            value === '' || value === null || (Number(value) >= min && Number(value) <= max)
                ? true
                : msg,

    /**
     * Expresión regular
     */
    regex:(pattern,msg="Formato inválido") =>
        (value) =>
            !value || pattern.test(value)
                ? true
                : msg,

    /**
     * Email
     */
    email:(msg="Correo inválido") =>
        (value) =>
            !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ? true
                : msg,

    /**
     * Solo números
     */
    numeric:(msg="Debe ser numérico") =>
        (value) =>
            !value || !isNaN(value)
                ? true
                : msg,

    /**
     * Solo enteros
     */
    integer:(msg="Debe ser un número entero") =>
        (value) =>
            !value || Number.isInteger(Number(value))
                ? true
                : msg,

    /**
     * Campo obligatorio si se cumple condición
     */
    requiredIf:(condition,msg="Campo requerido") =>
        (value,form) =>
            condition(form)
                ? (value ? true : msg)
                : true,

    /**
     * Campo obligatorio si otro campo tiene valor
     */
    requiredWith:(field,msg="Campo requerido") =>
        (value,form) =>
            form[field]
                ? (value ? true : msg)
                : true,

    /**
     * Igual a otro campo (ej: confirmar contraseña)
     */
    sameAs:(field,msg="Los campos no coinciden") =>
        (value,form) =>
            value === form[field]
                ? true
                : msg,

    /**
     * Diferente a otro campo
     */
    differentFrom:(field,msg="Debe ser diferente") =>
        (value,form) =>
            value !== form[field]
                ? true
                : msg,

    /**
     * Validación personalizada
     */
    custom:(fn,msg="Valor inválido") =>
        (value,form) =>
            fn(value,form)
                ? true
                : msg

}
export function validateForm(form,rulesConfig){
    console.log(rulesConfig)
    const errors = {}
    for(const field in rulesConfig){
        const value = form[field]
        console.log(field,value)
        const fieldRules = rulesConfig[field]
        console.log(fieldRules)
        for(const rule of fieldRules){
            const result = rule(value,form)
            console.log(result)
            if(result !== true){
                errors[field] = result
                break
            }

        }

    }

    return{
        valid:Object.keys(errors).length === 0,
        errors
    }

}