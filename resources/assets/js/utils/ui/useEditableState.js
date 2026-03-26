export function useEditableState(initialValue = null, options = {}) {

    const maxHistory = options.maxHistory || 50
  
    let original = null
    let present = null
    let past = []
    let future = []
    let initialized = false
  
    const deepCopy = (x) =>
      JSON.parse(JSON.stringify(x))
  
    const isEqual = (a,b) =>
      JSON.stringify(a) === JSON.stringify(b)
  
    function setExternalValue(val){
  
      if(val === null){
        clear()
        return
      }
  
      if(!initialized){
        original = deepCopy(val)
        present = deepCopy(val)
        initialized = true
        return
      }
  
      if(!isEqual(val, present)){
        setValue(val)
      }
    }
  
    function setValue(nextState){
      if(!initialized) return
      if(isEqual(nextState, present)) return
  
      past.push(deepCopy(present))
  
      if(past.length > maxHistory){
        past.shift()
      }
  
      present = deepCopy(nextState)
      future = []
    }
  
    function undo(){
      if(!past.length) return
  
      future.push(deepCopy(present))
      present = past.pop()
    }
  
    function redo(){
      if(!future.length) return
  
      past.push(deepCopy(present))
      present = future.pop()
    }
  
    function requestSave(){
      return deepCopy(present)
    }
  
    function confirmSave(){
      original = deepCopy(present)
      past = []
      future = []
    }
  
    function reset(){
      if(!original) return
      present = deepCopy(original)
      past = []
      future = []
    }
  
    function clear(){
      original = null
      present = null
      past = []
      future = []
      initialized = false
    }
  
    /* =====================
       ESTADO DERIVADO
    ====================== */
  
    function isDirty(){
      return original !== null &&
             !isEqual(original, present)
    }
  
    function canUndo(){
      return past.length > 0
    }
  
    function canRedo(){
      return future.length > 0
    }
  
    function canReset(){
      return isDirty()
    }
  
    return {
        getPresent: () => deepCopy(present),
        setExternalValue,
        setValue,
        undo,
        redo,
        reset,
        clear,
        requestSave,
        confirmSave,
    
        // estado
        isDirty,
        canUndo,
        canRedo,
        canReset
    }
  }