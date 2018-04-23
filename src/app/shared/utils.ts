export function values<T>(obj: { [key: string]: T }): T[] {
  return Object.keys(obj).map(key => obj[key])
}

export interface KeyedObj<T> {
  [key: string]: T
}
export function addKey<T>(obj: KeyedObj<T>) {
  Object.keys(obj).forEach(key => {
    obj[key]['key'] = key
  })
  return obj
}

// TODO: can this be combined with above
export interface IdedObj<T> {
  [id: string]: T
}
export function addId<T>(obj: IdedObj<T>) {
  Object.keys(obj).forEach(key => {
    obj[key]['id'] = key
  })
  return obj
}

// decorate class to unsubscribe looking at all properties
export function AutoUnsubscribe(constructor) {
  const original = constructor.prototype.ngOnDestroy
  if (!original || typeof original !== 'function') {
    console.warn(
      'Warning: You must implement ngOnDestroy method to use AutoUnsubscribe.'
    )
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
  return function(
    _target: any,
    _propertyKey: any,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value
    descriptor.value = function() {
      if (!this[subArray]) {
        console.log(
          'class must have property <',
          subArray,
          '> to use Unsubscribe decorator.'
        )
      } else {
        this[subArray].forEach(s => {
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
export function AutoUnsubscribeV2(
  _destroyFunc = 'ngOnDestroy',
  _subscriptionsArray = '_subscriptions'
) {
  return function(constructor) {
    const original = constructor.prototype[_destroyFunc]
    // constructor.prototype[_subscriptionsArray] = ['xxx', 'yyy']
    if (!original || typeof original !== 'function') {
      console.log(
        console.error(
          'You must add function <',
          _destroyFunc,
          '> method to use AutoUnsubscribe'
        )
      )
      return original.apply(this, arguments)
    } else {
      constructor.prototype[_destroyFunc] = function() {
        const subArray = this[_subscriptionsArray]
        if (subArray) {
          this[_subscriptionsArray].forEach(sub => {
            const property = this[sub]
            console.log('looking at this property: ', sub)
            if (property && typeof property.unsubscribe === 'function') {
              property.unsubscribe()
            }
          })
        } else {
          console.error(
            'You must add property <',
            _subscriptionsArray,
            '> method to use AutoUnsubscribe'
          )
        }
        return original.apply(this, arguments)
      }
    }
  }
}

export function AutoUnsubscribeFactory(verbose = true) {
  return function(constructor) {
    const original = constructor.prototype.ngOnDestroy
    if (!original || typeof original !== 'function') {
      if (verbose) {
        console.log(
          'You must implement ngOnDestroy method to use AutoUnsubscribe'
        )
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
