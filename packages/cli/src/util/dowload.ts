/**
 * @description fs的一个扩展，提供了非常多的便利API，并且继承了fs所有方法和为fs方法添加了promise的支持。
 */
import * as fs from 'fs-extra'
/**
 * @docsUrl https://nodejs.org/docs/latest/api/path.html
 */
import * as path from 'path'
import * as request from 'request'

const GITHUB_API = 'https://api.github.com/'
const GITHUB = 'https://github.com/'

/**
 * @description 获取Github最新发布版本
 * @param repoName 
 */
export function getGithubRepoLatestReleaseVersion (repoName: string) {
  const latestReleaseApi = `${GITHUB_API}repos/${repoName}/releases/latest`
  const p = new Promise((resolve, reject) => {
    request({
      url: latestReleaseApi,
      headers: {
        'User-Agent': 'Awesome-Octocat-App'
      }
    }, (err, response, body) => {
      if (err) {
        throw new Error('快应用容器版本请求失败，请重试！')
      }
      const res = JSON.parse(body)
      resolve(res.tag_name)
    })
  })
  return p
}

/**
 * @description Github最新版本下载
 * @param repoName 
 * @param appPath 
 * @param dest 
 */
export async function downloadGithubRepoLatestRelease (repoName: string, appPath: string, dest: string, type: string) {
  const latestTagName = await getGithubRepoLatestReleaseVersion(repoName)
  return new Promise((resolve, reject) => {
    let downloadUrl = "";
    switch (type) {
      case "zip":
      case "tar.gz":{
        downloadUrl = `${GITHUB}${repoName}/archive/${latestTagName}.${type}`
        break;
      }
      case "pkg":{
        downloadUrl = `${GITHUB}${repoName}/releases/download/${latestTagName}/${process.env.TANGRAM_ENV}.${type}`
        break;
      }
    }
    // https://github.com/rap-space/rap-cli/archive/1.2.4.tar.gz
    // https://github.com/rap-space/rap-cli/releases/download/1.2.4/rap.pkg
    const downloadTemp = `download_temp.${type}`
    request({
      url: downloadUrl,
      headers: {
        'User-Agent': 'Awesome-Octocat-App'
      }
    })
    .on('error', reject)
    .on('complete', () => {
      const downloadTempPath = path.join(appPath, downloadTemp)
      if (fs.existsSync(downloadTempPath)) {
        fs.moveSync(downloadTempPath, path.join(dest, downloadTemp))
        resolve()
      }
    })
    .pipe(fs.createWriteStream(downloadTemp))
  })
}
