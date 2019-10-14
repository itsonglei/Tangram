"use strict";
import * as fs from 'fs-extra'
import * as path from 'path'
import { PROJECT_CONFIG } from '../util/constants';
import CONFIG from './../config';
import chalk from 'chalk';
import { downloadGithubRepoLatestRelease } from '../util/dowload';
import { cleanNpm } from '../util/clean';
import { buildPkg } from '../util/build';
import { IInstallConfig } from 'src/util/types';


const TEMP_DIR = "./.temp";

class Compiler {
	project_config
	isWindows:boolean
	isMac: boolean
	isLinux: boolean
	// 构造函数
	constructor(public appPath: string){
		this.project_config = PROJECT_CONFIG;
		this.isWindows = /^win/.test(process.platform)
		this.isMac = process.platform === 'darwin'
		this.isLinux = process.platform === 'linux'
	}
	// 初始化
	async clean(){
		if (this.isMac) {
			cleanNpm();
		}
	}
	// 下载到 .temp 文件中
	async download(appPath){
		process.chdir(appPath)
		if (this.isMac) {
			let needDownload:boolean = false
			let type: string = "pkg";
			let repoName: string = "rap-space/rap-cli";
			console.log()
			if (fs.existsSync(path.join(TEMP_DIR, process.env.TANGRAM_ENV + CONFIG.DOWNLOAD_NAME + '.' + type))) {
				needDownload = false
			} else {
				needDownload = true
			}
			if (needDownload) {
				console.log(`${chalk.yellow('Loading...')} 手脚架下载中`)
				await downloadGithubRepoLatestRelease(repoName, appPath, TEMP_DIR, type)
				console.log(`${chalk.green('✔ ')} 手脚架已经准备好`)
			}else{
				console.log(`${chalk.green('✔ ')} 手脚架已经准备好`)
			}
			
		}
	}
	// 编译 & 安装
	async build (){
		if (this.isMac) {
			buildPkg();
		}
	}
}
// https://api.github.com/repos/rap-space/rap-cli/releases/latest
export async function install(appPath: string, installConfig: IInstallConfig){
	process.env.TANGRAM_ENV = installConfig.type;
	const compiler = new Compiler(appPath);
	// 初始化
	await compiler.clean();
	// 下载到 .temp 文件中
	await compiler.download(appPath);
	// 编译 & 安装
	await compiler.build();
}
