export function values<T>(obj: { [key: string]: T }): T[] {
  return Object.keys(obj).map(key => obj[key])
}

interface KeyedObj {
  [key: string]: any
}
export function addKey(obj: KeyedObj) {
  Object.keys(obj).forEach((key: string) => {
    obj[key]['key'] = key
  })
  return obj
}

export function addId(obj: any) {
  Object.keys(obj).forEach(key => {
    obj[key]['id'] = key
  })
  return obj
}

// decorate class to unsubscribe looking at all properties
export function AutoUnsubscribe(constructor: any) {
  const original = constructor.prototype.ngOnDestroy
  if (!original || typeof original !== 'function') {
    console.warn('Warning: You must implement ngOnDestroy method to use AutoUnsubscribe.')
  } else {
    constructor.prototype.ngOnDestroy = function() {
      Object.keys(this).forEach(prop => {
        const property = this[prop]
        if (property && typeof property.unsubscribe === 'function') {
          // console.log('unsubscribe called on this property: ', prop)
          property.unsubscribe()
        }
      })
      original.apply(this, arguments)
    }
  }
}

// decorate function to unsubscribe with array of subscriptions
export function Unsubscribe(subArray = '_subscriptions') {
  return function(_target: any, _propertyKey: any, descriptor: any) {
    const original = descriptor.value
    descriptor.value = function() {
      if (!this[subArray]) {
        console.log('class must have property <', subArray, '> to use Unsubscribe decorator.')
      } else {
        this[subArray].forEach((s: any) => {
          // console.log('unsubscribing from: ', s)
          if (typeof s.unsubscribe === 'function') {
            s.unsubscribe()
          }
        })
      }
      return original.apply(this, arguments)
    }
  }
}

// decorate class to unsubscribe looking at all properties
// export function AutoUnsubscribeV2(
//   _destroyFunc = 'ngOnDestroy',
//   _subscriptionsArray = '_subscriptions'
// ) {
//   return function(constructor: any) {
//     const original = constructor.prototype[_destroyFunc]
//     // constructor.prototype[_subscriptionsArray] = ['xxx', 'yyy']
//     if (!original || typeof original !== 'function') {
//       console.log(
//         console.error(
//           'You must add function <',
//           _destroyFunc,
//           '> method to use AutoUnsubscribe'
//         )
//       )
//       return original.apply(this, arguments)
//     } else {
//       constructor.prototype[_destroyFunc] = function() {
//         const subArray = this[_subscriptionsArray]
//         if (subArray) {
//           this[_subscriptionsArray].forEach(sub => {
//             const property = this[sub]
//             console.log('looking at this property: ', sub)
//             if (property && typeof property.unsubscribe === 'function') {
//               property.unsubscribe()
//             }
//           })
//         } else {
//           console.error(
//             'You must add property <',
//             _subscriptionsArray,
//             '> method to use AutoUnsubscribe'
//           )
//         }
//         return original.apply(this, arguments)
//       }
//     }
//   }
// }

export function AutoUnsubscribeFactory(verbose = true) {
  return function(constructor: any) {
    const original = constructor.prototype.ngOnDestroy
    if (!original || typeof original !== 'function') {
      if (verbose) {
        console.log('You must implement ngOnDestroy method to use AutoUnsubscribe')
      }
    } else {
      constructor.prototype.ngOnDestroy = function() {
        Object.keys(this).forEach(prop => {
          const property = this[prop]
          console.log('looking at this property: ', prop)
          if (property && typeof property.unsubscribe === 'function') {
            property.unsubscribe()
          }
        })
        original.apply(this, arguments)
      }
    }
  }
}
