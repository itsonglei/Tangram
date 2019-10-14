import chalk from "chalk";
import CONFIG from './../config';
import { exec } from 'child_process';
import { INSTALL_CLI_TYPES, INSTALL_TYPES } from "./constants";

/**
 * 安装已下载的 pkg 包
 */
export function buildPkg(){
	return new Promise((resolve, reject) => {
		console.log()
		console.log(chalk.yellow(`开始安装 ${process.env.TANGRAM_ENV} 环境~`))
		let command
		command = `sudo installer -pkg .temp/${process.env.TANGRAM_ENV}${CONFIG.DOWNLOAD_NAME}.pkg -target LocalSystem`;
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

/**
 * 安装全局 npm 包
 */
export function buildNpm(){
	return new Promise((resolve, reject) => {
		let pkgName
		switch (process.env.TANGRAM_ENV) {
			case INSTALL_TYPES.RAP:
				pkgName = INSTALL_CLI_TYPES.RAP_CLI;
				break;
			case INSTALL_TYPES.DVA:
				pkgName = INSTALL_CLI_TYPES.DVA_CLI;
				break;
		}
		console.log()
		console.log(chalk.yellow(`开始安装 ${pkgName} 环境~`))
		let command
		command = `npm install ${pkgName} -g`;
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