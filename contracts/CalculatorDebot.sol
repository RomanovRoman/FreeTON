pragma ton-solidity >= 0.45;

pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "../lib/debot/Debot.sol";
import "../lib/debot/Terminal.sol";
import "../lib/debot/NumberInput.sol";
import "../lib/debot/Menu.sol";

import "./ICalculator.sol";

contract CalculatorDebot is Debot {
    address _addrCalculator;

    constructor(address addrCalculator) public {
        tvm.accept();
        _addrCalculator = addrCalculator;
    }

    /// @notice Returns Metadata about DeBot.
    function getDebotInfo() public functionID(0xDEB) override view returns(
        string name, string version, string publisher, string key, string author,
        address support, string hello, string language, string dabi, bytes icon
    ) {
        name = "Calculator Debot";
        version = "0.0.1";
        publisher = "";
        key = "";
        author = "";
        support = address.makeAddrStd(0, 0x0);
        hello = "Hello, I'm DeBot";
        language = "en";
        dabi = m_debotAbi.get();
        icon = "";
    }

    function getRequiredInterfaces() public view override returns (uint256[] interfaces) {
        return [
            NumberInput.ID,
            Menu.ID,
            Terminal.ID
        ];
    }

    function start() public override {
        mainMenu(0);
    }

    uint32 idOperation;
    int x;

    function mainMenu(uint32 index) public {
        index;

        uint32 idSetOperation = tvm.functionId(setOperation);

        MenuItem[] items;
        items.push(MenuItem("Addition", "", idSetOperation));
        items.push(MenuItem("Subtraction", "", idSetOperation));
        items.push(MenuItem("Multiplication", "", idSetOperation));
        items.push(MenuItem("Division", "", idSetOperation));

        Menu.select("==What to do?==", "", items);
    }

    function setOperation(uint32 index) public {
        // Terminal.print(0, format("Chosen: {}", index));
        if ( index == 0 ) {
            idOperation = tvm.functionId(addition);
        } else if ( index == 1 ) {
            idOperation = tvm.functionId(subtraction);
        } else if ( index == 2 ) {
            idOperation = tvm.functionId(multiplication);
        } else {
            idOperation = tvm.functionId(division);
        }
        NumberInput.get(tvm.functionId(setX), "X", -100, 100);
    }

    function setX(int value) public {
        x = value;
        NumberInput.get(idOperation, "Y", -100, 100);
    }

    function addition(int value) public view {
        ICalculator(_addrCalculator).addition{
            abiVer: 2,
            extMsg: true,
            callbackId: tvm.functionId(result),
            onErrorId: 0,
            time: 0,
            expire: 0,
            sign: false
        }(x, value);
    }

    function subtraction(int value) public view {
        ICalculator(_addrCalculator).subtraction{
            abiVer: 2,
            extMsg: true,
            callbackId: tvm.functionId(result),
            onErrorId: 0,
            time: 0,
            expire: 0,
            sign: false
        }(x, value);
    }

    function multiplication(int value) public view {
        ICalculator(_addrCalculator).multiplication{
            abiVer: 2,
            extMsg: true,
            callbackId: tvm.functionId(result),
            onErrorId: 0,
            time: 0,
            expire: 0,
            sign: false
        }(x, value);
    }

    function division(int value) public view {
        ICalculator(_addrCalculator).division{
            abiVer: 2,
            extMsg: true,
            callbackId: tvm.functionId(result),
            onErrorId: 0,
            time: 0,
            expire: 0,
            sign: false
        }(x, value);
    }

    function result(int res) public {
        Terminal.print(0, format("Result: {}", res));
        mainMenu(0);
    }
}
