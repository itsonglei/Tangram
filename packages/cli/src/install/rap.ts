"use strict";
import { IInstallConfig } from '../util/types';
import * as fs from 'fs-extra'
import * as path from 'path'
import { INSTALL_TYPES, PROJECT_CONFIG } from '../util/constants';
import CONFIG from './../config';
import chalk from 'chalk';
import { exec } from 'child_process';
import { downloadGithubRepoLatestRelease } from '../util/dowload';


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
		console.log("this.isMac", this.isMac);
		if (this.isMac) {
			return new Promise((resolve, reject) => {
				console.log()
				console.log(chalk.yellow('开始初始化环境~'))
				let command
				command = `npm uninstall ${process.env.TANGRAM_ENV} -g`;
				exec(command, (err, stdout, stderr) => {
					if (err) reject()
					else {
						console.log(stdout)
						console.log(stderr)
					}
					resolve()
				})
			});
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
			console.log("dir:", TEMP_DIR, CONFIG.DOWNLOAD_NAME + '.' + type);
			if (fs.existsSync(path.join(TEMP_DIR, CONFIG.DOWNLOAD_NAME + '.' + type))) {
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
			return new Promise((resolve, reject) => {
				console.log()
				console.log(chalk.yellow(`开始安装 ${process.env.TANGRAM_ENV} 环境~`))
				let command
				command = `sudo installer -pkg .temp/${CONFIG.DOWNLOAD_NAME}.pkg -target LocalSystem`;
				console.log(command);
				exec(command, (err, stdout, stderr) => {
					if (err) reject()
					else {
						console.log(stdout)
						console.log(stderr)
					}
					resolve()
				})
			});
		}
	}
}
// https://api.github.com/repos/rap-space/rap-cli/releases/latest

export async function install (appPath: string, installConfig: IInstallConfig){
	console.log("rap");
	process.env.TANGRAM_ENV = INSTALL_TYPES.RAP;
	const compiler = new Compiler(appPath);
	// 初始化
	await compiler.clean();
	// 下载到 .temp 文件中
	await compiler.download(appPath);
	// 编译 & 安装
	await compiler.build();
}
