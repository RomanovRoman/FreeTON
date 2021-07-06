pragma ton-solidity >= 0.45.0;
pragma AbiHeader expire;


struct Operation {
    string name;
    int x;
    int y;
    int result;
}

interface ICalculator2 {
    function addition (int x, int y) external;
    function subtraction (int x, int y) external;
    function multiplication (int x, int y) external;
    function division (int x, int y) external;
    function getLastOperation(address who) external view returns(Operation);
}
