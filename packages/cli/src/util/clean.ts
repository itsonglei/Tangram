import chalk from 'chalk';
import { execSync } from 'child_process'
import { INSTALL_CLI_TYPES,INSTALL_TYPES } from '../util/constants';

/**
 * 卸载全局 npm 包
 */
export function cleanNpm(){
	// return new Promise((resolve, reject) => {
		let pkgName
		console.log(process.env.TANGRAM_ENV);
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
		console.log(chalk.yellow(`开始初始化 ${pkgName} 环境~`))
		let command
		command = `sudo npm uninstall ${pkgName} -g`;
		console.log(chalk.yellow(command))
		let result = execSync(command,{encoding:'utf8'});
		console.log(result);
		console.log(`${chalk.green('✔ ')} 初始化完成`);
	// });
}