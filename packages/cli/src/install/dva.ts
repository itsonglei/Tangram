"use strict";
import { cleanNpm } from '../util/clean';
import { buildNpm } from '../util/build';
import { IInstallConfig } from '../util/types';
import { PROJECT_CONFIG } from '../util/constants';

class Compiler {
	project_config
	isWindows: boolean
	isMac: boolean
	isLinux: boolean
	// 构造函数
	constructor(public appPath: string) {
		this.project_config = PROJECT_CONFIG;
		this.isWindows = /^win/.test(process.platform)
		this.isMac = process.platform === 'darwin'
		this.isLinux = process.platform === 'linux'
	}
	// 初始化
	async clean() {
		if (this.isMac) {
			cleanNpm();
		}
	}
	// 编译 & 安装
	async build(){
		if (this.isMac) {
			buildNpm();
		}
	}
}

// https://dvajs.com/guide/getting-started.html#%E5%AE%89%E8%A3%85-dva-cli
export async function install(appPath: string, installConfig:IInstallConfig){
	console.log(installConfig.type);
	process.env.TANGRAM_ENV = installConfig.type;
	const compiler = new Compiler(appPath);
	// 初始化
	await compiler.clean();
	// 编译 & 安装
	await compiler.build();
}