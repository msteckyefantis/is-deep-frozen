'use strict';

const subzero = require( 'subzero' );

const INPUT_VALUE = 'inputValue';

const nodeVersion = Number( process.versions.node.split( '.' )[0] );


const isDeepFrozen = subzero.megaFreeze( inputValue => {

    const nonFrozenPropertyDescriptors = [];

    addToNonFrozenPropertyDescriptorsIfNotMaximallyFrozen(

        INPUT_VALUE,
        inputValue,
        nonFrozenPropertyDescriptors
    );

    const testedAlready = [ inputValue ];

    testFrozennessOfPropertiesRecursively(

        INPUT_VALUE,
        inputValue,
        nonFrozenPropertyDescriptors,
        testedAlready
    );

    const result = getResult( nonFrozenPropertyDescriptors );

    cleanUpArrays( nonFrozenPropertyDescriptors, testedAlready );

    return result;
});


const addToNonFrozenPropertyDescriptorsIfNotMaximallyFrozen = subzero.megaFreeze(

    ( fullPropertyName, property, nonFrozenPropertyDescriptors ) => {

        if( isNotMaximallyFrozen( property ) ) {

            const valueAsAString = JSON.stringify( property, null, 4 ) || property.toString();

            const descriptor = `property: ${ fullPropertyName }, value: ${ valueAsAString }`;

            nonFrozenPropertyDescriptors.push( descriptor );
        }
    }
);


const isNotMaximallyFrozen = subzero.megaFreeze(

    property => {

        if( !(property instanceof Buffer) ) {

            return !Object.isFrozen( property );
        }
        else if( nodeVersion >= 6 ) {

            // buffers can only be sealed, and can't be frozen
            return !Object.isSealed( property );
        }
        else {

            return false;
        }
    }
);


const testFrozennessOfPropertiesRecursively = subzero.megaFreeze(

    ( basePath, value, nonFrozenPropertyDescriptors, testedAlready ) => {

        for( const propertyName of Object.getOwnPropertyNames( value ) ) {

            const property = value[ propertyName ];

            const propertyIsAFunctionOrAClass = (typeof property === 'function');

            const propertyIsAnObject = (property !== null) && (typeof property === 'object');

            const propertyHasNotBeenTestedAlready = (testedAlready.indexOf( property ) < 0);

            if(
                (propertyIsAFunctionOrAClass || propertyIsAnObject) &&

                propertyHasNotBeenTestedAlready
            ) {

                const fullPropertyName = `${ basePath }[ "${ propertyName }" ]`;

                addToNonFrozenPropertyDescriptorsIfNotMaximallyFrozen(

                    fullPropertyName,
                    property,
                    nonFrozenPropertyDescriptors
                );

                testedAlready.push( property );

                testFrozennessOfPropertiesRecursively(

                    fullPropertyName,
                    property,
                    nonFrozenPropertyDescriptors,
                    testedAlready
                );
            }
        }
    }
);


const getResult = subzero.megaFreeze( nonFrozenPropertyDescriptors => {

    const result = {};

    if( nonFrozenPropertyDescriptors.length > 0 ) {

        const error = new Error( nonFrozenPropertyDescriptors.join( '\n' ) );

        error.name = 'NotDeeplyFrozenError';

        result.error = error;

        result.notDeeplyFrozen = true;
    }

    return subzero.megaFreeze( result );
});


const cleanUpArrays = subzero.megaFreeze( ( array1, array2 ) => {

    for( const array of [ array1, array2 ] ) {

        array.length = 0;
        subzero.megaFreeze( array );
    }
});


module.exports = isDeepFrozen;
