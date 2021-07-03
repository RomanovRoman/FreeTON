pragma ton-solidity >= 0.45.0;
pragma AbiHeader expire;

import "./ICalculator.sol";

contract Calculator is ICalculator {

    function addition(int x, int y)
      external pure
      override
      returns (int)
    {
        return x + y;
    }

    function subtraction(int x, int y)
      external pure
      override
      returns (int)
    {
        return x - y;
    }

    function multiplication(int x, int y)
      external pure
      override
      returns (int)
    {
        return x * y;
    }

    function division(int x, int y)
      external pure
      override
      returns (int)
    {
        return x / y;
    }
}
