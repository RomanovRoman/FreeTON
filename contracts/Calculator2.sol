pragma ton-solidity >= 0.45.0;
pragma AbiHeader expire;

contract Calculator2 
{
    // здесь храним историю операций
    int[][] public history;
    
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
    
    // Вопрос в том, как нам получить ретёрн
    function addition (int x, int y) public accept payable returns (int)
    {
        history.push([x, y, x + y]);
        return x + y;
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
