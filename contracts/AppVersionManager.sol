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
    mapping (uint => Package) public packages;

    // List of all previous versions
    uint[] public versions;

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

        packages[package.version] = package;
        package = newPackage;
        versions.push(package.version);
        emit NewPackage(package.version, block.timestamp);
    }

    function findPackageAtTimestamp (uint timestamp) external view returns (Package memory) {
        if (package.timestamp <= timestamp) {
            return package;
        }
        // the countdown loop to find the latest package for the timestamp
        int i = int(versions.length);
        while (--i > -1) {
            Package memory pkg = packages[versions[uint(i)]];
            if (pkg.timestamp <= timestamp) {
                return pkg;
            }
        }
        revert("No package found");
    }

    function getPackage (uint version) external view returns (Package memory) {
        if (version == package.version) {
            return package;
        }
        return packages[version];
    }
}
