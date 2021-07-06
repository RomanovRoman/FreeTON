pragma ton-solidity >= 0.45.0;
pragma AbiHeader expire;

import "./ICalculator2.sol";


library Errors {
    uint constant IS_NOT_OWNER = 101;
    uint constant IS_EXT_MSG = 108;
    uint constant FEE_TOO_SMALL = 1001;
}

contract Calculator2 is ICalculator2 {

    // здесь храним историю операций
    // int[][] public history;
    mapping(address => Operation[]) public history;

    modifier checkPayment {
        require(msg.sender != address(0), Errors.IS_EXT_MSG);
        require(msg.value > 400 milliton, Errors.FEE_TOO_SMALL);
        tvm.accept();
        _;
    }

    function returnChange() private pure inline {
        msg.sender.transfer(0, false, 64);
    }

    constructor() public {
        require(tvm.pubkey() != 0, 101);
        require(msg.pubkey() == tvm.pubkey(), 102);
        tvm.accept();
    }

    // Вопрос в том, как нам получить ретёрн
    function addition(int x, int y)
      public override
      checkPayment
    {
        history[msg.sender].push(Operation("addition", x, y, x + y));
        returnChange();
    }

    function subtraction(int x, int y)
      public override
      checkPayment
    {
        history[msg.sender].push(Operation("subtraction", x, y, x - y));
        returnChange();
    }

    function multiplication(int x, int y)
      public override
      checkPayment
    {
        history[msg.sender].push(Operation("multiplication", x, y, x * y));
        returnChange();
    }

    function division(int x, int y)
      public override
      checkPayment
    {
        history[msg.sender].push(Operation("division", x, y, x / y));
        returnChange();
    }

    function getOperationHistory(address who)
        public view
        returns(Operation[])
    {
        return history[who];
    }

    function getLastOperation(address who)
      public view override
      returns(Operation)
    {
        if( history[who].length > 0 ) {
            return history[who][history[who].length - 1];
        }
        Operation empty;
        return empty;
    }
}
