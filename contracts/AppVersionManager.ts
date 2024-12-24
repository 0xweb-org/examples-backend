import { Ownable } from "@openzeppelin-mock/contracts/access/Ownable";

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
    public packages: Record<number, Package> ;

    // List of all previous versions
    public versions: number[] ;

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

        this.packages[this.package.version] = this.package;
        this.package = newPackage;
        this.versions.push(this.package.version);
        window.postMessage({ type: 'NewPackage', version: this.package.version, timestamp: block.timestamp });
    }

    public findPackageAtTimestamp (timestamp: number): Package {
        if (this.package.timestamp <= timestamp) {
            return this.package;
        }
        // the countdown loop to find the latest package for the timestamp
        let i = this.versions.length;
        while (--i > -1) {
            let pkg = this.packages[this.versions[i]];
            if (pkg.timestamp <= timestamp) {
                return pkg;
            }
        }
        throw new Error("No package found");
    }

    public getPackage (version: number): Package {
        if (version == this.package.version) {
            return this.package;
        }
        return this.packages[version];
    }
}

class TitleIsEmpty extends Error {
}
