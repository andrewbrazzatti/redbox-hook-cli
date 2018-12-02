let request = require('request');
let fs = require('fs');
let fsextra = require('node-fs-extra');
let process = require('process');
let downloadRelease = require('download-github-release');
let mustache = require('mustache');

class InitProject {

    execute(options) {
        this.downloadProjectTemplate(options.packageName);
        this.setPackageJson(options);
        this.setHookLinkScript(options);
    }

    setPackageJson(options) {
        let template = fs.readFileSync("package.json.mst", 'utf8')
        let output = mustache.render(template, options);
        fs.writeFileSync('package.json', output);
    }

    setHookLinkScript(options) {
        let template = fs.readFileSync("support/development/linkHook.sh.mst", 'utf8')
        let output = mustache.render(template, options);
        fs.writeFileSync("support/development/linkHook.sh", output);
    }

    filterRelease(release) {
        return release.prerelease === false;
    }

    filterAsset(asset) {
        return asset.name.indexOf('tar.gz') >= 0;;
    }

    downloadProjectTemplate() {
        let user = 'redbox-mint-contrib';
        let repo = 'sails-hook-redbox-provisioner-template';
        let outputDir = ".";
        let leaveZipped = false;
        if (fs.existsSync(outputDir)) {
            //TODO: Improve the error message
            console.error("Dir already exists");
            process.exit(1);
        }
        fsextra.mkdirpSync(outputDir);
        downloadRelease(user, repo, outputDir, this.filterRelease, this.filterAsset, leaveZipped)
            .then(function () {
                console.log('All done!');
            })
            .catch(function (err) {
                console.error(err.message);
            });
    }


}

module.exports = InitProject;
