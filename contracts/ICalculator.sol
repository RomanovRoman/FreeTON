pragma ton-solidity >= 0.45.0;
pragma AbiHeader expire;

interface ICalculator {
    function addition (int x, int y) external pure returns (int);
    function subtraction (int x, int y) external pure returns (int);
    function multiplication (int x, int y) external pure returns (int);
    function division (int x, int y) external pure returns (int);
}
