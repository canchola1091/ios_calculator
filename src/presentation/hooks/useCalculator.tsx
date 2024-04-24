
import { useEffect, useRef, useState } from "react"

enum Operator {
  add = '+',
  subtract = '-',
  multiply = 'x',
  divide = '÷',
}

export const useCalculator = () => {

  const [formula, setFormula] = useState('');
  
  const [number, setNumber] = useState('0');
  const [prevNumber, setPrevNumber] = useState('0');

  const lastOperation = useRef<Operator>();

  useEffect(() => {
    if( lastOperation.current ) {
      const firstFormulaPart = formula.split( ' ' ).at(0);
      setFormula( `${ firstFormulaPart } ${ lastOperation.current } ${ number }` );
    }else {
      setFormula( number );
    }
    
  }, [ number ]);

  useEffect(() => {
    const subResult = calculateSubResult();
    setPrevNumber( `${ subResult }`);
  }, [formula]);
  

  const clean = () => {
    setNumber( '0' );
    setPrevNumber('0');
    lastOperation.current = undefined;
    setFormula('');
  }

  // Borrar el último número
  const deleteOperation = () => {

    let currentSign: string = '';
    let temporalNumber: string = number;

    if( number.includes('-') ) {
      currentSign = '-';
      temporalNumber = number.substring(1); // -88 => 88
    }

    if( temporalNumber.length > 1 ) {
      return setNumber( currentSign + temporalNumber.slice(0, -1) );
    }

    setNumber('0');

  }

  const toogleSign = () => {
    if( number.includes('-') ) {
      return setNumber( number.replace('-', '') );
    }

    setNumber( '-' + number )
  }

  const buildNumber = ( numberString: string ) => {

    if( number.includes('.') && numberString === '.' ) return

    if( number.startsWith('0') || number.startsWith('-0') ) {

      // Punto decimal
      if( numberString === '.' ) {
        return setNumber(number + numberString);
      }

      // Evaluar si hay otro cero y no hay punto
      if( numberString === '0' && number.includes('.') ) {
        return setNumber( number + numberString );
      }

      // Evaluar si es diferente de cero, no hay punto decimal y es el primer número
      if( numberString !== '0' && !number.includes('.') ) {
        return setNumber( numberString );
      }

      // Evitar 00000.00
      if( numberString === '0' && !number.includes('.') ) {
        return;
      }

      return setNumber( number + numberString );
      
    }

    setNumber( number + numberString )

  }

  const setLastNumber = () => {

    calculateResult();

    if( number.endsWith('.' ) ) {
      setPrevNumber( number.slice(0, -1 ) );
    }else {
      setPrevNumber( number );
    }

    setNumber('0');

  }

  const divideOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.divide;
  }

  const multiplyOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.multiply;
  }

  const substractOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.subtract;
  }

  const addOperation = () => {
    setLastNumber();
    lastOperation.current = Operator.add;
  }
  
  const calculateResult = () => {

    const result = calculateSubResult();
    setFormula( `${ result }` );

    lastOperation.current = undefined;
    setPrevNumber('0');

  }

  const calculateSubResult = (): number => {
    
    const [ firstValue, operation, secondValue ] = formula.split(' ');
    
    const num1: number = Number(firstValue);
    const num2: number = Number(secondValue);

    if( isNaN( num2) ) return num1;

    switch ( operation ) {

      case Operator.add:
        return num1 + num2;

      case Operator.subtract:
        return num1 - num2;

      case Operator.multiply:
        return num1 * num2;

      case Operator.divide:
        return num1 / num2;
    
      default:
        throw new Error('Operation not implemented');
    }
  }

  return {
    // Properties
    number,
    prevNumber,
    formula,


    // Methods
    buildNumber,
    toogleSign,
    clean,
    deleteOperation,
    divideOperation,
    multiplyOperation,
    substractOperation,
    addOperation,
    calculateResult
  }
}
