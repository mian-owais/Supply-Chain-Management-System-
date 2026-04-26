// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    enum Role {
        None,
        Manufacturer,
        Distributor,
        Retailer
    }
    mapping(address => Role) public roles;
    address public admin;

    enum State {
        Created,
        InTransit,
        Delivered,
        Sold
    }

    struct HistoryRecord {
        State state;
        address actor;
        uint256 timestamp;
        string note;
    }

    struct Product {
        uint256 productId;
        string name;
        address manufacturer;
        address currentOwner;
        State currentState;
        uint256 createdAt;
        HistoryRecord[] history;
    }

    struct ProductView {
        uint256 productId;
        string name;
        address manufacturer;
        address currentOwner;
        State currentState;
        uint256 createdAt;
    }

    mapping(uint256 => Product) private products;
    uint256 public productCount;

    event RoleAssigned(address indexed account, Role role);
    event ProductCreated(
        uint256 indexed productId,
        string name,
        address manufacturer
    );
    event StateChanged(
        uint256 indexed productId,
        State newState,
        address actor,
        string note
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyRole(Role _role) {
        require(roles[msg.sender] == _role, "Unauthorized role");
        _;
    }

    modifier productExists(uint256 _id) {
        require(_id > 0 && _id <= productCount, "Product not found");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function assignRole(address _account, Role _role) external onlyAdmin {
        roles[_account] = _role;
        emit RoleAssigned(_account, _role);
    }

    function createProduct(
        string calldata _name
    ) external onlyRole(Role.Manufacturer) returns (uint256) {
        productCount++;
        uint256 id = productCount;
        Product storage p = products[id];
        p.productId = id;
        p.name = _name;
        p.manufacturer = msg.sender;
        p.currentOwner = msg.sender;
        p.currentState = State.Created;
        p.createdAt = block.timestamp;
        p.history.push(
            HistoryRecord(
                State.Created,
                msg.sender,
                block.timestamp,
                "Product created"
            )
        );
        emit ProductCreated(id, _name, msg.sender);
        return id;
    }

    function shipProduct(
        uint256 _id,
        string calldata _note
    ) external onlyRole(Role.Distributor) productExists(_id) {
        Product storage p = products[_id];
        require(p.currentState == State.Created, "Cannot ship: wrong state");
        p.currentOwner = msg.sender;
        p.currentState = State.InTransit;
        p.history.push(
            HistoryRecord(State.InTransit, msg.sender, block.timestamp, _note)
        );
        emit StateChanged(_id, State.InTransit, msg.sender, _note);
    }

    function receiveProduct(
        uint256 _id,
        string calldata _note
    ) external onlyRole(Role.Retailer) productExists(_id) {
        Product storage p = products[_id];
        require(
            p.currentState == State.InTransit,
            "Cannot receive: wrong state"
        );
        p.currentOwner = msg.sender;
        p.currentState = State.Delivered;
        p.history.push(
            HistoryRecord(State.Delivered, msg.sender, block.timestamp, _note)
        );
        emit StateChanged(_id, State.Delivered, msg.sender, _note);
    }

    function sellProduct(
        uint256 _id
    ) external onlyRole(Role.Retailer) productExists(_id) {
        Product storage p = products[_id];
        require(p.currentState == State.Delivered, "Cannot sell: wrong state");
        p.currentState = State.Sold;
        p.history.push(
            HistoryRecord(
                State.Sold,
                msg.sender,
                block.timestamp,
                "Sold to end customer"
            )
        );
        emit StateChanged(_id, State.Sold, msg.sender, "Sold to end customer");
    }

    function getProduct(
        uint256 _id
    ) external view productExists(_id) returns (ProductView memory) {
        Product storage p = products[_id];
        return
            ProductView(
                p.productId,
                p.name,
                p.manufacturer,
                p.currentOwner,
                p.currentState,
                p.createdAt
            );
    }

    function getAllProducts() external view returns (ProductView[] memory) {
        ProductView[] memory allProducts = new ProductView[](productCount);
        for (uint i = 0; i < productCount; i++) {
            Product storage p = products[i + 1];
            allProducts[i] = ProductView(
                p.productId,
                p.name,
                p.manufacturer,
                p.currentOwner,
                p.currentState,
                p.createdAt
            );
        }
        return allProducts;
    }

    function getHistory(
        uint256 _id
    ) external view productExists(_id) returns (HistoryRecord[] memory) {
        return products[_id].history;
    }

    function getUserRole(address _account) external view returns (Role) {
        return roles[_account];
    }
}
