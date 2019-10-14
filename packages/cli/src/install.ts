// import * as path from 'path'
// import * as fs from 'fs-extra'
// import chalk from 'chalk'
// import * as _ from 'lodash'

// const installForRap = require('./install/rap').default 

// import * as Util from './util'
// import CONFIG from './config'
// tsc -w
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
			installForDva(appPath, installConfig);
			break;
		case INSTALL_TYPES.FIE:
			installForFie(appPath, { });
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
 * 下载 dva
 * @param appPath 
 * @param installConfig 
 */
function installForDva(appPath: string, installConfig: IInstallConfig) {
	require('./install/dva').install(appPath, installConfig);
}

/**
 * 下载 fie
 * @param appPath 
 * @param installConfig 
 */
function installForFie(appPath: string, installConfig: IInstallConfig) {
	require('./install/fie').install(appPath, installConfig);
}


console.log();
console.log("Install");
console.log();