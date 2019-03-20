import {Observable} from 'rxjs'
export const DEBUG = false

export function fromEvent(name, element) {
  return new Observable(subscriber => {
    element.addEventListener(name, handler)

    return () => {
      element.removeEventListener(name, handler)
    }

    function handler(event) {
      subscriber.next(event)
    }
  })
}
