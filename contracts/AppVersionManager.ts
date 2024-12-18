import { Ownable } from "@openzeppelin/contracts/access/Ownable";

declare let msg: { sender: string };
declare let block: { timestamp: number };


type Package = {
    version: number;
    timestamp: number;
    url: string;
    sha256: string;
}

class AppVersionManager extends Ownable {

    public title: string;
    // @TODO: add further application related properties if required

    // Latest package
    public package: Package;

    // Track all versions and their packages
    public history: Record<number, Package> ;

    // List of all previous versions
    public previous: number[] ;

    constructor () {
        super(msg.sender)
    }

    @Ownable.onlyOwner
    public updateInfo(newTitle: string) {
        if (newTitle.length == 0) {
            throw new TitleIsEmpty();
        }
        this.title = newTitle;
        window.postMessage('NewApplicationInfo');
    }

    @Ownable.onlyOwner
    public updatePackage(newPackage: Package) {
        if (!(newPackage.version > this.package.version)) {
            throw new Error("Newer package already published");
        }

        this.history[this.package.version] = this.package;
        this.package = newPackage;
        this.previous.push(this.package.version);
        window.postMessage({ type: 'NewPackage', version: this.package.version, timestamp: block.timestamp });
    }

    public findPackageAtTimestamp (timestamp: number): Package {
        if (timestamp >= this.package.timestamp) {
            return this.package;
        }

        for (let i = this.previous.length - 1; i >= 0; i--) {
            let pkg = this.history[this.previous[i]];
            if (timestamp >= pkg.timestamp) {
                return pkg;
            }
        }
        throw new Error("No package found");
    }

    public getUpdatePackage (currentVersion: number): Package {
        if (currentVersion < this.package.version) {
            return this.package;
        }
        return {} as Package;
    }
}

class TitleIsEmpty extends Error {
}
