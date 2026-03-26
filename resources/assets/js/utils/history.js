// /utils/history.js
export function createHistory(initialState = []) {
    return {
        past: [],
        present: deepCopy(initialState),
        future: []
    }
}
  
export function pushState(hist, nextState) {
    hist.past.push(deepCopy(hist.present))
    hist.present = deepCopy(nextState)
    hist.future = []
}
  
export function undo(hist) {
    if (!hist.past.length) return false
    hist.future.push(deepCopy(hist.present))
    hist.present = hist.past.pop()
    return true
}
  
export function redo(hist) {
    if (!hist.future.length) return false
    hist.past.push(deepCopy(hist.present))
    hist.present = hist.future.pop()
    return true
}
  
function deepCopy(x) {
    return JSON.parse(JSON.stringify(x))
}