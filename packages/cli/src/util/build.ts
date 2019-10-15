import chalk from "chalk";
import CONFIG from './../config';
import { execSync } from 'child_process';
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
		let result = execSync(command, {encoding:'utf8'})
		console.log(result);
	});
}

/**
 * 安装全局 npm 包
 */
export function buildNpm(){
	// return new Promise((resolve, reject) => {
		let pkgName
		switch (process.env.TANGRAM_ENV) {
			case INSTALL_TYPES.RAP:
				pkgName = INSTALL_CLI_TYPES.RAP_CLI;
				break;
			case INSTALL_TYPES.DVA:
				pkgName = INSTALL_CLI_TYPES.DVA_CLI;
				break;
			case INSTALL_TYPES.AOP:
				pkgName = INSTALL_CLI_TYPES.AOP_CLI;
				break;
			case INSTALL_TYPES.QAP:
				pkgName = INSTALL_CLI_TYPES.QAP_CLI;
				break;
			case INSTALL_TYPES.TARO:
				pkgName = INSTALL_CLI_TYPES.TARO_CLI;
				break;
			case INSTALL_TYPES.FIE:
				pkgName = INSTALL_CLI_TYPES.FIE_CLI;
				break;
		}
		console.log()
		console.log(chalk.yellow(`开始安装 ${pkgName} 环境~`))
		let command
		command = `sudo npm install ${pkgName} -g`;

		console.log(chalk.yellow(command))
		try {
			let result = execSync(command,{encoding:'utf8'});
			console.log(result);
			console.log(`${chalk.green('✔ ')} 手脚架已经准备好`)
		} catch (error) {
			console.error(error);
			console.log(`${chalk.red('x ')} 手脚架下载失败`);
		}
	// });
}