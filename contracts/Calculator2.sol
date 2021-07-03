pragma ton-solidity >= 0.45.0;
pragma AbiHeader expire;


contract Calculator2 
{
    // здесь храним историю операций
    int[][] public history;
    
    event Calculation(
        string operation,
        int x,
        int y,
        int result
    );

    modifier accept()
    {
        tvm.accept();
        _;
    }

    constructor() public 
    {
        require(tvm.pubkey() != 0, 101);
        require(msg.pubkey() == tvm.pubkey(), 102);
        tvm.accept();
    }
    
    function push(
        string operation,
        int x,
        int y,
        int result
    )
        private inline
    {
        history.push([x, y, result]);
        emit Calculation(operation, x, y, result);
    }

    // Вопрос в том, как нам получить ретёрн
    function addition (int x, int y) public accept // payable returns (int r)
    {
        // history.push([x, y, x + y]);
        int r = x + y;
        push("addition", x, y, r);
    }

    function subtraction (int x, int y) public accept payable returns (int)
    {
        history.push([x, y, x - y]);
        return x - y;
    }

    function multiplication (int x, int y) public accept payable returns (int) 
    {
        history.push([x, y, x * y]);
        return x * y;
    }

    function division (int x, int y) public accept payable returns (int)
    {
        history.push([x, y, x / y]);
        return x / y;
    }
    
    function getHistory (uint index) public view returns(int[] memory)
    {
        return history[index];
    }
}
