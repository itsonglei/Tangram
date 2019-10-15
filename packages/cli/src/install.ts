// import * as path from 'path'
// import * as fs from 'fs-extra'
// import chalk from 'chalk'
// import * as _ from 'lodash'

// const installForRap = require('./install/rap').default 

// import * as Util from './util'
// import CONFIG from './config'
import { INSTALL_TYPES } from './util/constants'
import { IInstallConfig } from './util/types'

export default function install(appPath, installConfig: IInstallConfig) {
	const { type, pkgVersion } = installConfig;

	console.log("type",type);
	console.log("pkgVersion",pkgVersion);

	switch (type) {
		case INSTALL_TYPES.RAP:
			installForRap(appPath, installConfig);
			break;
		case INSTALL_TYPES.DVA:
		case INSTALL_TYPES.FIE:
		case INSTALL_TYPES.TARO:
		case INSTALL_TYPES.AOP:
		case INSTALL_TYPES.QAP:
			installForNpmInstall(appPath, installConfig);
			break;
		default:break;
	}
}

/**
 * 下载 rap
 * @param appPath 
 * @param installConfig 
 */
function installForRap(appPath: string, installConfig: IInstallConfig) {
	require('./install/rap').install(appPath, installConfig);
}

/**
 * 下载 dva/fie/qap/aop/taro
 * @param appPath 
 * @param installConfig 
 */
function installForNpmInstall(appPath: string, installConfig: IInstallConfig) {
	require('./install/npmInstall').install(appPath, installConfig);
}


console.log();
console.log("Install");
console.log();