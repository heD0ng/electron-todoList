// import { rm } from 'fs/promises'
import fs from 'fs';
import path from "path";
import config from '../../../vite.config';

export class CleanPlugin {
    options: any;
    constructor(options) {
        // this.options = options;
        this.init();
    }
    init() {
        console.log('config11111',config);
        return 
    }
    apply(compiler) {
        compiler.hooks.emit.tapPromise("CleanPlugin", async () => {
            const { dir } = this.options;
            const absolutePath = path.resolve(__dirname, dir);
            // await rm(absolutePath, { recursive: true, force: true });
        });
    }
}


function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
        const curPath = `${path}/${file}`;
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }
export default CleanPlugin;
