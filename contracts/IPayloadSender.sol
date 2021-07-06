pragma ton-solidity >= 0.45;

interface IPayloadSender {

    function sendTransaction(
        address dest,
        uint128 value,
        bool bounce,
        uint8 flags,
        TvmCell payload)
    external;
}
