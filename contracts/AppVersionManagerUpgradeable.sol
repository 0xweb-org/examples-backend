import { AppVersionManager } from "./AppVersionManager.sol";
import { Initializable } from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract AppVersionManagerUpgradeable is Initializable, AppVersionManager {


    function initialize (address owner) external initializer {
        _transferOwnership(owner);
    }
}
