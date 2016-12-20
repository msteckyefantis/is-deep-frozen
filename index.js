'use strict';

const subzero = require( 'subzero' );


module.exports = subzero.megaFreeze( function isDeepFrozen( inputValue ) {

    const notFrozen = [];

    addToNotFrozenIfNotFrozen( 'input value itself', inputValue, notFrozen )

    const testedAlready = [ inputValue ];

    testFrozennessOfPropertiesRecursively( inputValue, notFrozen, testedAlready );

    const result = {};

    if( notFrozen.length > 0 ) {

        const error = new Error( notFrozen.join( '\n' ) )

        error.name = 'NotDeeplyFrozenError';

        result.error = error;

        result.notFrozen = true;
    }

    notFrozen.length = 0;
    testedAlready.length = 0;
    subzero.megaFreeze( notFrozen );
    subzero.megaFreeze( testedAlready );

    return subzero.megaFreeze( result );
});


const testFrozennessOfPropertiesRecursively = subzero.megaFreeze( function( value, notFrozen, testedAlready ) {

    for( const propertyName of Object.getOwnPropertyNames( value ) ) {

        const property = value[ propertyName ];

        const propertyIsAFunctionOrClass = (typeof property === 'function');

        const propertyIsAnObject = (property !== null) && (typeof property === 'object');

        const propertyHasNotBeenTestedAlready = (testedAlready.indexOf( property ) < 0);

        if(
            (propertyIsAFunctionOrClass || propertyIsAnObject) &&

            propertyHasNotBeenTestedAlready
        ) {

            addToNotFrozenIfNotFrozen( propertyName, property, notFrozen );

            testedAlready.push( property );

            testFrozennessOfPropertiesRecursively( property, notFrozen, testedAlready );
        }
    }
});


const addToNotFrozenIfNotFrozen = subzero.megaFreeze( ( propertyName, property, notFrozen ) => {

    if( !Object.isFrozen( property ) ) {

        let stringErrorValue = JSON.stringify( property, null, 4 ) || property.toString();

        notFrozen.push( `property: ${ propertyName }, value: ${ stringErrorValue }` );
    }
});
