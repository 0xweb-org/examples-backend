import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

struct Package {
    uint version;
    uint timestamp;
    string url;
    bytes32 sha256;
}

contract AppVersionManager is Ownable {

    // Events that are emitted on data updates
    event NewApplicationInfo();
    event NewPackage(uint version, uint timestamp);

    // Custom error, when title for the application is empty
    error TitleIsEmpty();

    // Some application information
    string public title;
    // @TODO: add further application related properties if required

    // Latest package
    Package public package;

    // Track all versions and their packages
    mapping (uint => Package) public history;

    // List of all previous versions
    uint[] public previous;

    constructor () Ownable(msg.sender) {

    }

    function updateInfo(string calldata newTitle) external onlyOwner {
        if (bytes(newTitle).length == 0) {
            revert TitleIsEmpty();
        }
        title = newTitle;
        emit NewApplicationInfo();
    }

    function updatePackage(Package calldata newPackage) external onlyOwner {
        require(newPackage.version > package.version, "Newer package already published");

        history[package.version] = package;
        package = newPackage;
        previous.push(package.version);
        emit NewPackage(package.version, block.timestamp);
    }

    function findPackageAtTimestamp (uint timestamp) external view returns (Package memory) {
        if (timestamp >= package.timestamp) {
            return package;
        }

        for (uint i = previous.length - 1; i >= 0; i--) {
            Package memory pkg = history[previous[i]];
            if (timestamp >= pkg.timestamp) {
                return pkg;
            }
        }
        revert("No package found");
    }

    function getPackage (uint version) external view returns (Package memory) {
        if (version == package.version) {
            return package;
        }
        return history[version];
    }
}
