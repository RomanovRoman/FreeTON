pragma ton-solidity >= 0.45;

pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "../lib/debot/Debot.sol";
import "../lib/debot/Terminal.sol";
import "../lib/debot/AddressInput.sol";
import "../lib/debot/NumberInput.sol";
import "../lib/debot/SigningBoxInput.sol";
import "../lib/debot/Menu.sol";

import "./IPayloadSender.sol";
import "./ICalculator2.sol";

library StrOperations {
    string constant addition = "Addition";
    string constant subtraction = "Subtraction";
    string constant multiplication = "Multiplication";
    string constant division = "Division";
}

contract CalculatorDebot2 is Debot {
    address _addrCalculator;
    address _addrMultisig;
    uint32 _keyHandle;

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
            AddressInput.ID,
            NumberInput.ID,
            SigningBoxInput.ID,
            Menu.ID,
            Terminal.ID
        ];
    }

    function start() public override {
        mainMenu(0);
    }

    function onError(uint32 sdkError, uint32 exitCode) public {
        Terminal.print(0, format("Sdk error {}. Exit code {}.", sdkError, exitCode));
        mainMenu(0);
    }

    uint32 idOperation;
    // string strOperationName;
    int x;
    int y;

    function mainMenu(uint32 index) public {
        index;

        if(_addrMultisig == address(0)) {
            Terminal.print(0, 'In order to create Event you need to attach Multisig');
            attachMultisig();
            return;
        }

        uint32 idSetOperation = tvm.functionId(setOperation);

        MenuItem[] items;
        items.push(MenuItem("Addition", "", idSetOperation));
        items.push(MenuItem("Subtraction", "", idSetOperation));
        items.push(MenuItem("Multiplication", "", idSetOperation));
        items.push(MenuItem("Division", "", idSetOperation));

        Menu.select("==What to do?==", "", items);
    }

    function setOperation(uint32 index) public {
        Terminal.print(0, format("Chosen: {}", index));
        if ( index == 0 ) {
            idOperation = tvm.functionId(addition);
            // strOperationName = StrOperations.addition;
        } else if ( index == 1 ) {
            idOperation = tvm.functionId(subtraction);
            // strOperationName = StrOperations.subtraction;
        } else if ( index == 2 ) {
            idOperation = tvm.functionId(multiplication);
            // strOperationName = StrOperations.multiplication;
        } else {
            idOperation = tvm.functionId(division);
            // strOperationName = StrOperations.division;
        }
        NumberInput.get(tvm.functionId(setX), "X", -100, 100);
    }

    function setX(int value) public {
        x = value;
        NumberInput.get(tvm.functionId(setY), "Y", -100, 100);
    }

    function setY(int value) public {
        y = value;
        CheckSignHandle();
    }

    function CheckSignHandle() public {
        if (_keyHandle == 0) {
            uint[] none;
            SigningBoxInput.get(tvm.functionId(setKeyHandle), "Enter keys to sign all operations.", none);
            return;
        }

        Terminal.print(idOperation, format("({},{})", x, y));
    }

    function setKeyHandle(uint32 handle) public {
        Terminal.print(0, format("msig {}", handle));
        _keyHandle = handle;
        CheckSignHandle();
    }

    function attachMultisig() public {
        AddressInput.get(tvm.functionId(saveMultisig), "Enter Multisig address");
    }

    function saveMultisig(address value) public {
        _addrMultisig = value;
        mainMenu(0);
    }

    function send(TvmCell payload) public view {
        optional(uint256) none;
        IPayloadSender(_addrMultisig).sendTransaction{
            abiVer: 2,
            extMsg: true,
            sign: true,
            pubkey: none,
            time: 0,
            expire: 0,
            callbackId: tvm.functionId(result),
            onErrorId: tvm.functionId(onError),
            signBoxHandle: _keyHandle
        } (
            _addrCalculator,
            0.7 ton,
            false,
            3,
            payload
        );
    }

    function addition() public view {
        TvmCell payload = tvm.encodeBody(ICalculator2.addition, x, y);
        send(payload);
    }

    function subtraction() public view {
        TvmCell payload = tvm.encodeBody(ICalculator2.subtraction, x, y);
        send(payload);
    }

    function multiplication() public view {
        TvmCell payload = tvm.encodeBody(ICalculator2.multiplication, x, y);
        send(payload);
    }

    function division() public view {
        TvmCell payload = tvm.encodeBody(ICalculator2.division, x, y);
        send(payload);
    }

    function result() public view {
        ICalculator2(_addrCalculator).getLastOperation{
            abiVer: 2,
            extMsg: true,
            callbackId: tvm.functionId(printResult),
            onErrorId: 0,
            time: 0,
            expire: 0,
            sign: false
        }(_addrMultisig);
    }

    function printResult(Operation res) public {
        Terminal.print(0, format("Operation: {}({}, {}) = {}",
            res.name,
            res.x,
            res.y,
            res.result
        ));
        mainMenu(0);
    }
}
