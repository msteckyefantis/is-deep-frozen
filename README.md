# is-deep-frozen? [![npm version](https://badge.fury.io/js/is-deep-frozen.svg)](https://badge.fury.io/js/is-deep-frozen) [![Build Status](https://travis-ci.org/msteckyefantis/is-deep-frozen.svg?branch=master)](https://travis-ci.org/msteckyefantis/is-deep-frozen)


[![dkconfused.png](https://s27.postimg.org/lri7kmepv/dkconfused.png)](https://postimg.org/image/g3bwtqadb/)

The question that has plagued monkey-kind and human-kind for millions of years.
🙉🙊🙈


##About:

Find out if your javascript object, function, or class is deeply frozen.

> Note: Primitive javascript types (e.g. string or number) are considered to be deeply frozen in this module.

If you want to deeply freeze your objects, you can use the following:

1. [subzero](https://github.com/msteckyefantis/subzero)
2. [deep-freeze](https://github.com/substack/deep-freeze)
3. [immutablejs](https://github.com/facebook/immutable-js/)

##install:

```
npm install is-deep-frozen
```

##usage:
```.js
'use strict';

const isDeepFrozen = require( 'is-deep-frozen' );


const o = Object.freeze({ xxx: 69 });

const passingResult = isDeepFrozen( o );

// passingResult will be {}, indicating o is deeply frozen


const f = function() {};

f.a = Object.freeze({ b: {} });

const failingResult = isDeepFrozen( f );

// failingResult.notFrozen will be set to true

console.log( failingResult.error );

/*
    the resulting log is:

    { NotDeeplyFrozenError: property: input value itself, value: function () {}
        property: prototype, value: {}
        property: b, value: {}
            at isDeepFrozen (/Users/test_dir/index.js:20:23)
            ...
    }
*/
```
