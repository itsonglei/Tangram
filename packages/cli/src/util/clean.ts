import chalk from 'chalk';
import { exec } from 'child_process'
import { INSTALL_CLI_TYPES,INSTALL_TYPES } from '../util/constants';

/**
 * 卸载全局 npm 包
 */
export function cleanNpm(){
	return new Promise((resolve, reject) => {
		let pkgName
		console.log(process.env.TANGRAM_ENV);
		switch (process.env.TANGRAM_ENV) {
			case INSTALL_TYPES.RAP:
				pkgName = INSTALL_CLI_TYPES.RAP_CLI;
				break;
			case INSTALL_TYPES.DVA:
				pkgName = INSTALL_CLI_TYPES.DVA_CLI;
				break;
		}
		console.log()
		console.log(chalk.yellow(`开始初始化 ${pkgName} 环境~`))
		let command
		command = `npm uninstall ${pkgName} -g`;
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