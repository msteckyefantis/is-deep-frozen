'use strict';

const subzero = require( 'subzero' );

const INPUT_VALUE = 'inputValue';


module.exports = subzero.megaFreeze( function isDeepFrozen( inputValue ) {

    const notFrozen = [];

    addToNotFrozenIfNotFrozen( INPUT_VALUE, inputValue, notFrozen )

    const testedAlready = [ inputValue ];

    testFrozennessOfPropertiesRecursively( INPUT_VALUE, inputValue, notFrozen, testedAlready );

    const result = {};

    if( notFrozen.length > 0 ) {

        const error = new Error( notFrozen.join( '\n' ) )

        error.name = 'NotDeeplyFrozenError';

        result.error = error;

        result.notDeeplyFrozen = true;
    }

    notFrozen.length = 0;
    testedAlready.length = 0;
    subzero.megaFreeze( notFrozen );
    subzero.megaFreeze( testedAlready );

    return subzero.megaFreeze( result );
});


const testFrozennessOfPropertiesRecursively = subzero.megaFreeze( function( basePath, value, notFrozen, testedAlready ) {

    for( const propertyName of Object.getOwnPropertyNames( value ) ) {

        const property = value[ propertyName ];

        const propertyIsAFunctionOrAClass = (typeof property === 'function');

        const propertyIsAnObject = (property !== null) && (typeof property === 'object');

        const propertyHasNotBeenTestedAlready = (testedAlready.indexOf( property ) < 0);

        if(
            (propertyIsAFunctionOrAClass || propertyIsAnObject) &&

            propertyHasNotBeenTestedAlready
        ) {

            const fullPropertyName =  `${ basePath }[ "${ propertyName }" ]`;

            addToNotFrozenIfNotFrozen( fullPropertyName, property, notFrozen );

            testedAlready.push( property );

            testFrozennessOfPropertiesRecursively( fullPropertyName, property, notFrozen, testedAlready );
        }
    }
});


const addToNotFrozenIfNotFrozen = subzero.megaFreeze( function( fullPropertyName, property, notFrozen ) {

    if( !Object.isFrozen( property ) ) {

        const valueAsString = JSON.stringify( property, null, 4 ) || property.toString();

        notFrozen.push( `property: ${ fullPropertyName }, value: ${ valueAsString }` );
    }
});
